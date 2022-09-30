import type { Optional } from '../../common';

export type LocaleAttributes = {
  id: string;
  englishName: string;
  localName: string;
  respondentLanguageId: string;
  adminLanguageId: string;
  countryFlagCode: string;
  prototypeLocaleId: string | null;
  textDirection: string;
  foodIndexLanguageBackendId: string;
};

export type LocaleCreationAttributes = Optional<
  LocaleAttributes,
  'prototypeLocaleId' | 'textDirection'
>;
