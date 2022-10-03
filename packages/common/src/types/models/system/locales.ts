import type { OmitAndOptional, Optional } from '../../common';

export type LocaleAttributes = {
  id: string;
  code: string;
  englishName: string;
  localName: string;
  respondentLanguageId: string;
  adminLanguageId: string;
  countryFlagCode: string;
  prototypeLocaleId: string | null;
  textDirection: string;
  foodIndexLanguageBackendId: string;
  ownerId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type LocaleCreationAttributes = OmitAndOptional<
  LocaleAttributes,
  'id' | 'createdAt' | 'updatedAt',
  'prototypeLocaleId' | 'textDirection' | 'foodIndexLanguageBackendId' | 'ownerId'
>;

export type FoodsLocaleAttributes = {
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

export type FoodsLocaleCreationAttributes = Optional<
  FoodsLocaleAttributes,
  'prototypeLocaleId' | 'textDirection' | 'foodIndexLanguageBackendId'
>;
