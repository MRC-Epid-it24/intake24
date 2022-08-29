import type { IoC } from '@intake24/api/ioc';
import type { I18nParams } from '@intake24/i18n';
import { api, replaceParams } from '@intake24/i18n';

export type TranslationObject = { [key: string]: TranslationObject } | string;

export type TranslationStore = {
  en: TranslationObject;
  [key: string]: TranslationObject;
};

const i18nStore = ({ logger: globalLogger, models }: Pick<IoC, 'logger' | 'models'>) => {
  const logger = globalLogger.child({ service: 'I18nStore' });

  let store = api as TranslationStore;
  let availableLanguages = Object.keys(store);

  /**
   * Initialize i18n store
   * - load built-in & database translations
   */
  const init = async () => {
    await reload();

    logger.info(`Store has been loaded.`);
  };

  /**
   * Reload i18n store
   *
   */
  const reload = async () => {
    const translations = await models.system.LanguageTranslation.findAll({
      where: { application: 'api' },
    });

    const dbStore = translations.reduce<{ [key: string]: any }>((acc, item) => {
      const { languageId, section, messages } = item;
      if (!acc[languageId]) acc[languageId] = {};

      if (!acc[languageId][section]) acc[languageId][section] = {};

      acc[languageId][section] = messages;

      return acc;
    }, {});

    store = { ...store, ...dbStore };
    availableLanguages = Object.keys(store);
  };

  const getAvailableLanguages = () => availableLanguages;

  /**
   * Resolve dot-notation i18n object path
   *
   * @param {string} key
   * @param {string} locale
   * @returns
   */
  const resolvePath = (key: string, locale: string) => {
    const messages = store[locale] ?? store.en;

    const message = key.split('.').reduce((acc, seg) => {
      if (typeof acc === 'string') return acc;

      if (!acc[seg]) return key;

      return acc[seg];
    }, messages);

    return message.toString();
  };

  const translate = (key: string, locale: string, params?: I18nParams) => {
    const message = resolvePath(key, locale);

    return params ? replaceParams(message, params) : message;
  };

  return { init, reload, getAvailableLanguages, translate };
};

export default i18nStore;

export type I18nStore = ReturnType<typeof i18nStore>;
