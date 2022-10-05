import type { PhraseMatchResult } from '@intake24/api/food-index/phrase-index';
import type { FoodHeader } from '@intake24/common/types/http';
import type Logger from '@intake24/services/logger/logger';
import { getFixedRanking } from '@intake24/api/food-index/ranking/fixed-ranking';

export type RankingAlgorithm = '';

export type RankingData = {
  [foodCode: string]: number;
};

export interface FoodSearchRankingAlgorithm {
  getFoodRanking(localeId: string, foodCodes: string[]): Promise<RankingData>;
}

function noAlgorithmRanking(results: PhraseMatchResult<string>[]): FoodHeader[] {
  return results
    .sort((a, b) => a.quality - b.quality)
    .map((result) => ({ code: result.key, description: result.phrase }));
}

function mapValues<T1, T2>(obj: { [s: string]: T1 }, fn: (value: T1) => T2): { [s: string]: T2 } {
  const entries: [string, T1][] = Object.entries(obj); // inference fails
  return Object.fromEntries(entries.map((entry) => [entry[0], fn(entry[1])]));
}

function normaliseRankingData(ranking: RankingData): RankingData {
  if (Object.keys(ranking).length === 0) {
    return {};
  }

  const min = Math.min(...Object.values(ranking));
  const max = Math.max(...Object.values(ranking));

  const range = max - min;

  if (Math.abs(range) < 1e-6) {
    // Map single or repeating values to 1
    return mapValues(ranking, (_) => 1);
  } else {
    return mapValues(ranking, (v) => (v - min) / range);
  }
}

function normaliseMatchCost(results: PhraseMatchResult<string>[]): PhraseMatchResult<string>[] {
  if (results.length === 0) return [];

  const costs = results.map((r) => r.quality);

  const min = Math.min(...costs);
  const max = Math.max(...costs);

  const range = max - min;

  // Convert match cost to score, i.e. higher is better
  if (Math.abs(range) < 1e-6) {
    return results.map((r) => ({ key: r.key, phrase: r.phrase, quality: 1 }));
  } else {
    return results.map((r) => ({
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
  logger: typeof Logger
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

      const combinedScore =
        rankingScore * (1 - matchScoreWeight) + result.quality * matchScoreWeight;

      return {
        header: {
          code: result.key,
          description: result.phrase,
        },
        rankingScore: combinedScore,
      };
    })
    .sort((h1, h2) => h2.rankingScore - h1.rankingScore)
    .map((h) => h.header);
}

export async function rankSearchResults(
  results: PhraseMatchResult<string>[],
  localeId: string,
  algorithm: string,
  matchScoreWeight: number,
  logger: typeof Logger
): Promise<FoodHeader[]> {
  switch (algorithm) {
    case 'fixed': {
      const rankingData = await getFixedRanking(
        localeId,
        results.map((result) => result.key)
      );

      return applyRankingData(rankingData, results, matchScoreWeight, logger);
    }
    default:
      logger.warn(`Ranking algorithm "${algorithm}" is not supported`);
      return noAlgorithmRanking(results);
  }
}
