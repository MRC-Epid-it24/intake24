import type { LanguageAttributes, LanguageTranslationAttributes } from '@intake24/db';

export type I18nLanguageListEntry = Pick<
  LanguageAttributes,
  'code' | 'englishName' | 'localName' | 'countryFlagCode' | 'textDirection'
>;

export type I18nLanguageEntry = I18nLanguageListEntry
  & Pick<LanguageTranslationAttributes, 'messages'>;
