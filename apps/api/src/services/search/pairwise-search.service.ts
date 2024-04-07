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

export type CopyAssociationsOps = JobParams['LocalePopularitySearchCopy'];

function pairwiseSearchService({ db }: Pick<IoC, 'db'>) {
  /**
   * Copy Pairwise associations data from one locale to another
   *
   * @param {CopyAssociationsOps} options
   */
  const copyAssociations = async (options: CopyAssociationsOps) => {
    const { localeId, sourceLocaleId } = options;

    const [locale, sourceLocale] = await Promise.all([
      SystemLocale.findByPk(localeId, { attributes: ['id', 'code'] }),
      SystemLocale.findByPk(sourceLocaleId, { attributes: ['id', 'code'] }),
    ]);

    if (!sourceLocale || !locale)
      throw new NotFoundError();

    const { code: localeCode } = locale;
    const { code: sourceLocaleCode } = sourceLocale;

    await db.system.transaction(async (transaction) => {
      await Promise.all([
        PAOccurrence.destroy({ where: { localeId: localeCode }, transaction }),
        PACoOccurrence.destroy({ where: { localeId: localeCode }, transaction }),
        PAOccurrenceTransactionCount.destroy({ where: { localeId: localeCode }, transaction }),
      ]);

      const { occurrences, coOccurrences, transactionsCount } = copyPairwiseAssociationsQueries();

      await Promise.all(
        [occurrences, coOccurrences, transactionsCount].map(query =>
          db.system.query(query, { replacements: { localeCode, sourceLocaleCode }, transaction }),
        ),
      );
    });
  };

  return {
    copyAssociations,
  };
}

export default pairwiseSearchService;

export type PairwiseSearchService = ReturnType<typeof pairwiseSearchService>;
