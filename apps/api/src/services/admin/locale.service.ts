import { FoodsLocale, Op, SplitList, SplitWord, SynonymSet } from '@intake24/db';
import type {
  LocaleSplitListInput,
  LocaleSplitWordInput,
  LocaleSynonymSetInput,
} from '@intake24/common/types/http/admin';
import { NotFoundError } from '@intake24/api/http/errors';

const localeService = () => {
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

  return {
    getSplitLists,
    setSplitLists,
    getSplitWords,
    setSplitWords,
    getSynonymSets,
    setSynonymSets,
  };
};

export default localeService;

export type LocaleService = ReturnType<typeof localeService>;
