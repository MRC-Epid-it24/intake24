import type { IoC } from '@intake24/api/ioc';
import type { JobParams } from '@intake24/common/types';
import { NotFoundError } from '@intake24/api/http/errors';
import {
  copyPairwiseAssociationsQueries,
  PACoOccurrence,
  PAOccurrence,
  PAOccurrenceTransactionCount,
  SystemLocale,
} from '@intake24/db';

export type CopyAssociationsOps = JobParams['PairwiseSearchCopyAssociations'];

const pairwiseSearchService = ({ db }: Pick<IoC, 'db'>) => {
  /**
   * Copy Pairwise associations data from one locale to another
   *
   * @param {CopyAssociationsOps} options
   */
  const copyAssociations = async (options: CopyAssociationsOps) => {
    const { sourceLocaleId, targetLocaleId } = options;

    const locales = await SystemLocale.findAll({ where: { id: [sourceLocaleId, targetLocaleId] } });
    if (locales.length !== 2) throw new NotFoundError();

    await db.system.transaction(async (transaction) => {
      await Promise.all([
        PAOccurrence.destroy({ where: { localeId: targetLocaleId }, transaction }),
        PACoOccurrence.destroy({ where: { localeId: targetLocaleId }, transaction }),
        PAOccurrenceTransactionCount.destroy({ where: { localeId: targetLocaleId }, transaction }),
      ]);

      const { occurrences, coOccurrences, transactionsCount } = copyPairwiseAssociationsQueries();

      await Promise.all(
        [occurrences, coOccurrences, transactionsCount].map((query) =>
          db.system.query(query, { replacements: { sourceLocaleId, targetLocaleId }, transaction })
        )
      );
    });
  };

  return {
    copyAssociations,
  };
};

export default pairwiseSearchService;

export type PairwiseSearchService = ReturnType<typeof pairwiseSearchService>;
