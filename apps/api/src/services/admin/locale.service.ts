import type { IoC } from '@intake24/api/ioc';
import type { GetJobParams, JobType } from '@intake24/common/types';
import type {
  LocaleRecipeFoodsInput,
  LocaleSplitListInput,
  LocaleSplitWordInput,
  LocaleSynonymSetInput,
} from '@intake24/common/types/http/admin';
import type { Job } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import {
  Op,
  RecipeFoods,
  RecipeFoodsSteps,
  SplitList,
  SplitWord,
  SynonymSet,
  SystemLocale,
} from '@intake24/db';

export type QueueLocaleTaskInput = {
  userId: string;
  job: JobType;
  params: GetJobParams<JobType>;
};

const localeService = ({ scheduler }: Pick<IoC, 'scheduler'>) => {
  const resolveLocale = async (localeId: string | SystemLocale): Promise<SystemLocale> => {
    const locale = typeof localeId === 'string' ? await SystemLocale.findByPk(localeId) : localeId;
    if (!locale) throw new NotFoundError();

    return locale;
  };
  const getSplitLists = async (localeId: string | SystemLocale) => {
    const { code } = await resolveLocale(localeId);

    return SplitList.findAll({ where: { localeId: code }, order: [['id', 'ASC']] });
  };

  const setSplitLists = async (
    localeId: string | SystemLocale,
    splitLists: LocaleSplitListInput[]
  ) => {
    const { code } = await resolveLocale(localeId);

    const ids = splitLists.map(({ id }) => id) as string[];
    await SplitList.destroy({ where: { localeId: code, id: { [Op.notIn]: ids } } });

    if (!splitLists.length) return [];

    const records = await SplitList.findAll({ where: { localeId: code }, order: [['id', 'ASC']] });
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

      const newRecord = await SplitList.create({ localeId: code, firstWord, words });
      newRecords.push(newRecord);
    }

    return [...records, ...newRecords];
  };

  const getSplitWords = async (localeId: string | SystemLocale) => {
    const { code } = await resolveLocale(localeId);

    return SplitWord.findAll({ where: { localeId: code }, order: [['id', 'ASC']] });
  };

  const setSplitWords = async (
    localeId: string | SystemLocale,
    splitWords: LocaleSplitWordInput[]
  ) => {
    const { code } = await resolveLocale(localeId);

    const ids = splitWords.map(({ id }) => id) as string[];
    await SplitWord.destroy({ where: { localeId: code, id: { [Op.notIn]: ids } } });

    if (!splitWords.length) return [];

    const records = await SplitWord.findAll({ where: { localeId: code }, order: [['id', 'ASC']] });
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

      const newRecord = await SplitWord.create({ localeId: code, words });
      newRecords.push(newRecord);
    }

    return [...records, ...newRecords];
  };

  const getSynonymSets = async (localeId: string | SystemLocale) => {
    const { code } = await resolveLocale(localeId);

    return SynonymSet.findAll({ where: { localeId: code }, order: [['id', 'ASC']] });
  };

  const setSynonymSets = async (
    localeId: string | SystemLocale,
    synonymSets: LocaleSynonymSetInput[]
  ) => {
    const { code } = await resolveLocale(localeId);

    const ids = synonymSets.map(({ id }) => id) as string[];
    await SynonymSet.destroy({ where: { localeId: code, id: { [Op.notIn]: ids } } });

    if (!synonymSets.length) return [];

    const records = await SynonymSet.findAll({ where: { localeId: code }, order: [['id', 'ASC']] });
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

      const newRecord = await SynonymSet.create({ localeId: code, synonyms });
      newRecords.push(newRecord);
    }

    return [...records, ...newRecords];
  };

  // Recipe Foods Get & Set
  const getRecipeFoods = async (localeId: string | SystemLocale) => {
    const { code } = await resolveLocale(localeId);

    return RecipeFoods.findAll({
      where: { localeId: code },
      include: [
        { model: RecipeFoodsSteps, as: 'steps' },
        { model: SynonymSet, as: 'synonyms' },
      ],
      order: [
        ['id', 'ASC'],
        [{ model: RecipeFoodsSteps, as: 'steps' }, 'order', 'ASC'],
      ],
    });
  };

  const setRecipeFoods = async (
    localeId: string | SystemLocale,
    recipeFoods: LocaleRecipeFoodsInput[]
  ) => {
    const { code } = await resolveLocale(localeId);
    // To distinguish between the locale code and the special food code
    const localeCode = code;
    console.log(`\n\n setRecipeFoods - Recieved saving request: ${recipeFoods} - ${localeId}\n\n`);

    const ids = recipeFoods.map(({ id }) => id) as string[];
    await RecipeFoods.destroy({ where: { localeId: localeCode, id: { [Op.notIn]: ids } } });

    if (!recipeFoods.length) return [];

    const records = await RecipeFoods.findAll({
      where: { localeId: localeCode },
      order: [['id', 'ASC']],
    });
    const newRecords: RecipeFoods[] = [];

    for (const recipeFood of recipeFoods) {
      const { id, code, name, recipeWord, synonyms_id } = recipeFood;
      // To distinguish between the locale code and the special food code
      const recipeFoodCode = code;

      if (id) {
        const match = records.find((record) => record.id === id);
        if (match) {
          await match.update({ code, name, recipeWord, synonyms_id });
          continue;
        }
      }

      const newRecord = await RecipeFoods.create({
        localeId: localeCode,
        code: recipeFoodCode,
        name,
        recipeWord,
        synonyms_id,
      });
      newRecords.push(newRecord);
    }

    return [...records, ...newRecords];
  };

  const uploadFoodRanking = async (
    localeId: number,
    localeCode: string,
    userId: string,
    file: Express.Multer.File
  ): Promise<Job> => {
    const locale = await SystemLocale.findByPk(localeId);
    if (!locale) throw new NotFoundError();

    return scheduler.jobs.addJob({
      type: 'FoodRankingCsvUpload',
      userId,
      params: { localeId, localeCode, file: file.path },
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

    return scheduler.jobs.addJob({ type: job, userId, params });
  };

  return {
    getRecipeFoods,
    setRecipeFoods,
    getSplitLists,
    setSplitLists,
    getSplitWords,
    setSplitWords,
    getSynonymSets,
    setSynonymSets,
    uploadFoodRanking,
    queueLocaleTask,
  };
};

export default localeService;

export type LocaleService = ReturnType<typeof localeService>;
