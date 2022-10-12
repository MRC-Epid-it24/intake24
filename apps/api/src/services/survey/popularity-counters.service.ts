import type { IoC } from '@intake24/api/ioc';
import { PAOccurrence, PopularityCounter } from '@intake24/db';

export default class PopularityCountersService {
  private readonly db;
  private readonly logger;

  constructor({ logger, db }: Pick<IoC, 'logger' | 'db'>) {
    this.logger = logger;
    this.db = db;
  }

  private countOccurrences(foodCodes: string[]): { [k: string]: number } {
    const result: { [k: string]: number } = {};

    for (const code of foodCodes) {
      result[code] = (result[code] ?? 0) + 1;
    }

    return result;
  }

  public async updateGlobalCounters(foodCodes: string[]): Promise<void> {
    const occurrences = this.countOccurrences(foodCodes);
    return this.db.system.transaction(async (tx) => {
      const counters = await PopularityCounter.findAll({
        where: { foodCode: foodCodes },
        transaction: tx,
      });

      const currentCounts = Object.fromEntries(counters.map((row) => [row.foodCode, row.counter]));

      for (const k in occurrences) {
        const count = currentCounts[k];
        if (count) occurrences[k] += count;
      }

      const updates = Object.entries(occurrences).map((e) => ({ foodCode: e[0], counter: e[1] }));

      await PopularityCounter.bulkCreate(updates, {
        updateOnDuplicate: ['counter'],
        transaction: tx,
      });
    });
  }

  /*
  This is normally done by the pairwise associations service, but the decision whether to
  implement it is still pending so handle it here for now.
  */
  public async updateLocalCounters(localeId: string, foodCodes: string[]): Promise<void> {
    const occurrences = this.countOccurrences(foodCodes);

    return this.db.system.transaction(async (tx) => {
      const counters = await PAOccurrence.findAll({
        where: { localeId, foodCode: foodCodes },
        transaction: tx,
      });

      const currentCounts = Object.fromEntries(
        counters.map((row) => [row.foodCode, row.occurrences])
      );

      for (const k in occurrences) {
        const count = currentCounts[k];
        if (count) occurrences[k] += count;
      }

      const updates = Object.entries(occurrences).map((e) => ({
        localeId,
        foodCode: e[0],
        occurrences: e[1],
      }));

      await PAOccurrence.bulkCreate(updates, {
        updateOnDuplicate: ['occurrences'],
        transaction: tx,
      });
    });
  }
}
