import type { LanguageTranslationAttributes, LanguageAttributes } from '../models/system/languages';

export type I18nLanguageListEntry = Pick<
  LanguageAttributes,
  'id' | 'englishName' | 'localName' | 'countryFlagCode'
>;

export type I18nLanguageEntry = Pick<
  LanguageAttributes,
  'id' | 'englishName' | 'localName' | 'countryFlagCode' | 'textDirection'
> &
  Pick<LanguageTranslationAttributes, 'messages'>;
