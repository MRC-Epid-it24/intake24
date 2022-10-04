import NodeCache from 'node-cache';

import type { RankingData } from '@intake24/api/food-index/ranking/ranking';
import { FixedFoodRanking } from '@intake24/db';

const cache = new NodeCache({ stdTTL: 600, checkperiod: 600 });

function key(localeId: string, foodCode: string): string {
  return `${localeId}.${foodCode}`;
}

export async function getFixedRanking(localeId: string, foods: string[]): Promise<RankingData> {
  const keys = foods.map((code) => key(localeId, code));

  const ranking = cache.mget<number>(keys);

  const codesToFetch = foods.filter((code) => !ranking[code]);

  const rows = await FixedFoodRanking.findAll({
    attributes: ['foodCode', 'rank'],
    where: { localeId, foodCode: codesToFetch },
  });

  const newCacheEntries = rows.map((row) => ({ key: key(localeId, row.foodCode), val: row.rank }));

  cache.mset(newCacheEntries);

  rows.forEach((row) => {
    ranking[row.foodCode] = row.rank;
  });

  return ranking;
}
