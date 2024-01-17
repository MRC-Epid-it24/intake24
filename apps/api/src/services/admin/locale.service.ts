import type { IoC } from '@intake24/api/ioc';
import type { QueueJob } from '@intake24/common/types';
import type {
  LocaleRecipeFoodsInput,
  LocaleRecipeFoodStepsInput,
  LocaleSplitListInput,
  LocaleSplitWordInput,
  LocaleSynonymSetInput,
} from '@intake24/common/types/http/admin';
import { NotFoundError } from '@intake24/api/http/errors';
import { addDollarSign } from '@intake24/api/util';
import {
  Op,
  RecipeFoods,
  RecipeFoodsSteps,
  SplitList,
  SplitWord,
  SynonymSet,
  SystemLocale,
} from '@intake24/db';

const localeService = ({ scheduler }: Pick<IoC, 'scheduler'>) => {
  const resolveLocale = async (localeId: string | SystemLocale): Promise<SystemLocale> => {
    const locale =
      typeof localeId === 'string'
        ? await SystemLocale.findByPk(localeId, { attributes: ['id', 'code'] })
        : localeId;
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

  // Get existing recipe foods for the specified Locale ID
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

  // Get existing recipe food steps for the specific recipe food for the specified Locale ID
  const getRecipeFoodSteps = async (
    localeId: string | SystemLocale,
    recipeFoodId: string
  ): Promise<RecipeFoodsSteps[]> => {
    const { code } = await resolveLocale(localeId);

    return RecipeFoodsSteps.findAll({
      where: { localeId: code, recipeFoodsId: recipeFoodId },
      order: [['order', 'ASC']],
    });
  };

  // Add/modify/delete new or existing recipe foods for the specified Locale ID
  const setRecipeFoods = async (
    localeId: string | SystemLocale,
    recipeFoods: LocaleRecipeFoodsInput[]
  ) => {
    const { code: localeCode } = await resolveLocale(localeId);

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
      const recipeFoodCode = addDollarSign(code);

      if (id) {
        const match = records.find((record) => record.id === id);
        if (match) {
          await match.update({ code: recipeFoodCode, name, recipeWord, synonyms_id });
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

  // Add/modify/delete new or existing recipe food steps for the specific recipe food for the specified Locale ID
  const setRecipeFoodSteps = async (
    localeId: string | SystemLocale,
    recipeFoodId: string,
    recipeFoodSteps: LocaleRecipeFoodStepsInput[]
  ) => {
    const { code: localeCode } = await resolveLocale(localeId);
    const ids = recipeFoodSteps.map(({ id }) => id) as string[];
    await RecipeFoodsSteps.destroy({
      where: { localeId: localeCode, recipeFoodsId: recipeFoodId, id: { [Op.notIn]: ids } },
    });

    if (!recipeFoodSteps.length) return [];

    const records = await RecipeFoodsSteps.findAll({
      where: { localeId: localeCode, recipeFoodsId: recipeFoodId },
      order: [['order', 'ASC']],
    });
    const newRecords: RecipeFoodsSteps[] = [];

    for (const recipeFoodStep of recipeFoodSteps) {
      const { id, code, name, description, categoryCode, order, repeatable, required } =
        recipeFoodStep;

      if (id) {
        const match = records.find((record) => record.id === id);
        if (match) {
          await match.update({
            code,
            name,
            description,
            categoryCode,
            localeId: localeCode,
            order,
            repeatable,
            required,
          });
          continue;
        }
      }

      const newRecord = await RecipeFoodsSteps.create({
        localeId: localeCode,
        recipeFoodsId: parseInt(recipeFoodId),
        code,
        name,
        description,
        categoryCode,
        order,
        repeatable,
        required: false,
      });
      newRecords.push(newRecord);
    }

    return [...records, ...newRecords];
  };

  /**
   * Queue locale tasks
   *
   * @param {QueueJob} input
   * @returns
   */
  const queueTask = async (input: QueueJob) => scheduler.jobs.addJob(input);

  return {
    getRecipeFoods,
    setRecipeFoods,
    getRecipeFoodSteps,
    setRecipeFoodSteps,
    getSplitLists,
    setSplitLists,
    getSplitWords,
    setSplitWords,
    getSynonymSets,
    setSynonymSets,
    queueTask,
  };
};

export default localeService;

export type LocaleService = ReturnType<typeof localeService>;
