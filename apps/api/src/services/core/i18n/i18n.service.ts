import type { RequestIoC } from '@intake24/api/ioc';
import type { I18nParams } from '@intake24/i18n/util';

const i18nService = ({
  i18nStore,
  clientLanguages,
}: Pick<RequestIoC, 'i18nStore' | 'clientLanguages'>) => {
  const translate = (key: string, params?: I18nParams) => {
    const availableLanguages = i18nStore.getAvailableLanguages();
    clientLanguages.filter((lang) => availableLanguages.includes(lang));
    const selectedLocale = clientLanguages.length ? clientLanguages[0] : 'en';

    return i18nStore.translate(key, selectedLocale, params);
  };

  return { translate };
};

export default i18nService;

export type I18nService = ReturnType<typeof i18nService>;
