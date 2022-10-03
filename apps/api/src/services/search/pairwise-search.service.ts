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

    const [sourceLocale, targetLocale] = await Promise.all([
      SystemLocale.findByPk(sourceLocaleId),
      SystemLocale.findByPk(targetLocaleId),
    ]);

    if (!sourceLocale || !targetLocale) throw new NotFoundError();

    const { code: sourceLocaleCode } = sourceLocale;
    const { code: targetLocaleCode } = targetLocale;

    await db.system.transaction(async (transaction) => {
      await Promise.all([
        PAOccurrence.destroy({ where: { localeId: targetLocaleCode }, transaction }),
        PACoOccurrence.destroy({ where: { localeId: targetLocaleCode }, transaction }),
        PAOccurrenceTransactionCount.destroy({
          where: { localeId: targetLocaleCode },
          transaction,
        }),
      ]);

      const { occurrences, coOccurrences, transactionsCount } = copyPairwiseAssociationsQueries();

      await Promise.all(
        [occurrences, coOccurrences, transactionsCount].map((query) =>
          db.system.query(query, {
            replacements: { sourceLocaleCode, targetLocaleCode },
            transaction,
          })
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
