import type { PhraseMatchResult } from '@intake24/api/food-index/phrase-index';
import type { SearchSortingAlgorithm } from '@intake24/common/surveys';
import type { CategoryHeader, FoodHeader } from '@intake24/common/types/http';
import type { Logger } from '@intake24/common-backend';
import { getFixedRanking } from '@intake24/api/food-index/ranking/fixed-ranking';
import { getGlobalPopularityRanking } from '@intake24/api/food-index/ranking/global-popularity';
import { getLocalPopularityRanking } from '@intake24/api/food-index/ranking/local-popularity';

export type RankingAlgorithm = '';

export type RankingData = {
  [foodCode: string]: number;
};

function noAlgorithmRanking(results: PhraseMatchResult<string>[]): FoodHeader[] {
  return results
    .sort((a, b) => a.quality - b.quality)
    .map(result => ({ code: result.key, name: result.phrase }));
}

function mapValues<T1, T2>(obj: { [s: string]: T1 }, fn: (value: T1) => T2): { [s: string]: T2 } {
  const entries = Object.entries(obj);
  return Object.fromEntries(entries.map(entry => [entry[0], fn(entry[1])]));
}

function normaliseRankingData(ranking: RankingData): RankingData {
  if (Object.keys(ranking).length === 0)
    return {};

  const min = Math.min(...Object.values(ranking));
  const max = Math.max(...Object.values(ranking));

  const range = max - min;

  if (Math.abs(range) < 1e-6) {
    // Map single or repeating values to 1
    return mapValues(ranking, _ => 1);
  }
  else {
    return mapValues(ranking, v => (v - min) / range);
  }
}

function normaliseMatchCost(results: PhraseMatchResult<string>[]): PhraseMatchResult<string>[] {
  if (results.length === 0)
    return [];

  const costs = results.map(r => r.quality);

  const min = Math.min(...costs);
  const max = Math.max(...costs);

  const range = max - min;

  // Convert match cost to score, i.e. higher is better
  if (Math.abs(range) < 1e-6) {
    return results.map(r => ({ key: r.key, phrase: r.phrase, quality: 1 }));
  }
  else {
    return results.map(r => ({
      key: r.key,
      phrase: r.phrase,
      quality: 1.0 - (r.quality - min) / range,
    }));
  }
}

function applyRankingData(
  rankingData: RankingData,
  results: PhraseMatchResult<string>[],
  matchScoreWeight: number,
  logger: Logger,
): FoodHeader[] {
  const normalisedRankingData = normaliseRankingData(rankingData);
  const normalisedSearchResults = normaliseMatchCost(results);

  return normalisedSearchResults
    .map((result) => {
      let rankingScore = normalisedRankingData[result.key];

      if (rankingScore === undefined) {
        logger.warn(`No ranking data for food code "${result.key}"`);
        rankingScore = 0;
      }

      const combinedScore
        = rankingScore * (1 - matchScoreWeight) + result.quality * matchScoreWeight;

      return {
        header: { code: result.key, name: result.phrase },
        rankingScore: combinedScore,
      };
    })
    .sort((h1, h2) => h2.rankingScore - h1.rankingScore)
    .map(h => h.header);
}

async function getRankingData(
  algorithm: SearchSortingAlgorithm,
  localeId: string,
  foodCodes: string[],
  logger: Logger,
): Promise<RankingData | null> {
  switch (algorithm) {
    case 'fixed':
      return getFixedRanking(localeId, foodCodes);
    case 'globalPop':
      return getGlobalPopularityRanking(foodCodes);
    case 'popularity':
      return getLocalPopularityRanking(localeId, foodCodes);
    default: {
      logger.warn(`Ranking algorithm "${algorithm}" is not supported`);
      return null;
    }
  }
}

export async function rankFoodResults(
  results: PhraseMatchResult<string>[],
  localeId: string,
  algorithm: SearchSortingAlgorithm,
  matchScoreWeight: number,
  logger: Logger,
  recipeFoodsHeaders: FoodHeader[],
): Promise<FoodHeader[]> {
  const foodCodes = results.map(result => result.key);
  const rankingData = await getRankingData(algorithm, localeId, foodCodes, logger);

  if (rankingData !== null) {
    return recipeFoodsHeaders.concat(
      applyRankingData(rankingData, results, matchScoreWeight, logger),
    );
  }
  else {
    return recipeFoodsHeaders.concat(noAlgorithmRanking(results));
  }
}

export function rankCategoryResults(results: PhraseMatchResult<string>[]): CategoryHeader[] {
  return results
    .sort((a, b) => a.quality - b.quality)
    .map(result => ({ code: result.key, name: result.phrase }));
}
