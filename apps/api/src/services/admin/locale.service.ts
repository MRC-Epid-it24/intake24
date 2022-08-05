import {
  copyPairwiseAssociationsQueries,
  FoodsLocale,
  Op,
  PAOccurrence,
  PACoOccurrence,
  PAOccurrenceTransactionCount,
  SplitList,
  SplitWord,
  SynonymSet,
  SystemLocale,
} from '@intake24/db';
import type {
  LocaleSplitListInput,
  LocaleSplitWordInput,
  LocaleSynonymSetInput,
} from '@intake24/common/types/http/admin';
import { NotFoundError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import type { JobParams, JobType, JobTypeParams } from '@intake24/common/types';

export type CopyPairwiseAssociationsOps = JobParams['LocaleCopyPairwiseAssociations'];

export type QueueLocaleTaskInput = {
  userId: string;
  job: JobType;
  params: JobTypeParams;
};

const localeService = ({ db, scheduler }: Pick<IoC, 'db' | 'scheduler'>) => {
  const getSplitLists = async (localeId: string) => {
    const locale = await FoodsLocale.findByPk(localeId, {
      include: { association: 'splitLists', order: [['id', 'ASC']] },
    });
    if (!locale) throw new NotFoundError();

    const { splitLists = [] } = locale;

    return splitLists;
  };

  const setSplitLists = async (localeId: string, splitLists: LocaleSplitListInput[]) => {
    const locale = await FoodsLocale.findByPk(localeId);
    if (!locale) throw new NotFoundError();

    const ids = splitLists.map(({ id }) => id) as string[];
    await SplitList.destroy({ where: { localeId, id: { [Op.notIn]: ids } } });

    if (!splitLists.length) return [];

    const records = await SplitList.findAll({ where: { localeId }, order: [['id', 'ASC']] });
    const newRecords: SplitList[] = [];

    for (const splitList of splitLists) {
      const { id, firstWord, words } = splitList;

      if (id) {
        const match = records.find((record) => record.id === id);
        if (match) {
          await match.update({ firstWord, words });
          continue;
        }
      }

      const newRecord = await SplitList.create({ localeId, firstWord, words });
      newRecords.push(newRecord);
    }

    return [...records, ...newRecords];
  };

  const getSplitWords = async (localeId: string) => {
    const locale = await FoodsLocale.findByPk(localeId, {
      include: { association: 'splitWords', order: [['id', 'ASC']] },
    });
    if (!locale) throw new NotFoundError();

    const { splitWords = [] } = locale;

    return splitWords;
  };

  const setSplitWords = async (localeId: string, splitWords: LocaleSplitWordInput[]) => {
    const locale = await FoodsLocale.findByPk(localeId);
    if (!locale) throw new NotFoundError();

    const ids = splitWords.map(({ id }) => id) as string[];
    await SplitWord.destroy({ where: { localeId, id: { [Op.notIn]: ids } } });

    if (!splitWords.length) return [];

    const records = await SplitWord.findAll({ where: { localeId }, order: [['id', 'ASC']] });
    const newRecords: SplitWord[] = [];

    for (const splitWord of splitWords) {
      const { id, words } = splitWord;

      if (id) {
        const match = records.find((record) => record.id === id);
        if (match) {
          await match.update({ words });
          continue;
        }
      }

      const newRecord = await SplitWord.create({ localeId, words });
      newRecords.push(newRecord);
    }

    return [...records, ...newRecords];
  };

  const getSynonymSets = async (localeId: string) => {
    const locale = await FoodsLocale.findByPk(localeId, {
      include: { association: 'synonymSets', order: [['id', 'ASC']] },
    });
    if (!locale) throw new NotFoundError();

    const { synonymSets = [] } = locale;

    return synonymSets;
  };

  const setSynonymSets = async (localeId: string, synonymSets: LocaleSynonymSetInput[]) => {
    const locale = await FoodsLocale.findByPk(localeId);
    if (!locale) throw new NotFoundError();

    const ids = synonymSets.map(({ id }) => id) as string[];
    await SynonymSet.destroy({ where: { localeId, id: { [Op.notIn]: ids } } });

    if (!synonymSets.length) return [];

    const records = await SynonymSet.findAll({ where: { localeId }, order: [['id', 'ASC']] });
    const newRecords: SynonymSet[] = [];

    for (const synonymSet of synonymSets) {
      const { id, synonyms } = synonymSet;

      if (id) {
        const match = records.find((record) => record.id === id);
        if (match) {
          await match.update({ synonyms });
          continue;
        }
      }

      const newRecord = await SynonymSet.create({ localeId, synonyms });
      newRecords.push(newRecord);
    }

    return [...records, ...newRecords];
  };

  /**
   * Copy Pairwise associations data from one locale to another
   *
   * @param {CopyPairwiseAssociationsOps} options
   */
  const copyPairwiseAssociations = async (options: CopyPairwiseAssociationsOps) => {
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

  /**
   * Queue locale tasks
   *
   * @param {QueueLocaleTaskInput} input
   * @returns
   */
  const queueLocaleTask = async (input: QueueLocaleTaskInput) => {
    const { userId, job, params } = input;

    return scheduler.jobs.addJob({ type: job, userId }, params);
  };

  return {
    getSplitLists,
    setSplitLists,
    getSplitWords,
    setSplitWords,
    getSynonymSets,
    setSynonymSets,
    copyPairwiseAssociations,
    queueLocaleTask,
  };
};

export default localeService;

export type LocaleService = ReturnType<typeof localeService>;
