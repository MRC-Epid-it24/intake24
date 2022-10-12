import NodeCache from 'node-cache';

import type { RankingData } from '@intake24/api/food-index/ranking/ranking';
import { FixedFoodRanking } from '@intake24/db';

const cache = new NodeCache({ stdTTL: 600, checkperiod: 600 });

function toKey(localeId: string, foodCode: string): string {
  return `${localeId}.${foodCode}`;
}

function toCode(localeId: string, key: string): string {
  return key.substring(localeId.length + 1);
}

function mapKeys<T>(obj: { [k: string]: T }, fn: (value: string) => string): { [k: string]: T } {
  const entries = Object.entries(obj);
  return Object.fromEntries(entries.map((entry) => [fn(entry[0]), entry[1]]));
}

export async function getFixedRanking(localeId: string, foods: string[]): Promise<RankingData> {
  const keys = foods.map((code) => toKey(localeId, code));

  const ranking = mapKeys(cache.mget<number>(keys), (k) => toCode(localeId, k));

  const codesToFetch = foods.filter((code) => !ranking[code]);

  if (codesToFetch.length > 0) {
    const rows = await FixedFoodRanking.findAll({
      attributes: ['foodCode', 'rank'],
      where: { localeId, foodCode: codesToFetch },
    });

    const newCacheEntries = rows.map((row) => ({
      key: toKey(localeId, row.foodCode),
      val: row.rank,
    }));

    cache.mset(newCacheEntries);

    rows.forEach((row) => {
      ranking[row.foodCode] = row.rank;
    });
  }

  return ranking;
}
