import { TextDirection } from '../../common';
import { LanguageAttributes, LanguageTranslationAttributes, Pagination } from '../../models';

export type LanguageRequest = {
  id: string;
  englishName: string;
  localName: string;
  countryFlagCode: string;
  textDirection: TextDirection;
};

export type CreateLanguageRequest = LanguageRequest;

export type UpdateLanguageRequest = Omit<LanguageRequest, 'id'>;

export type LanguagesResponse = Pagination<LanguageAttributes>;

export type LanguageEntry = LanguageAttributes;

export type LanguageListEntry = Pick<
  LanguageAttributes,
  'id' | 'englishName' | 'localName' | 'countryFlagCode'
>;

export type LanguageTranslationEntry = LanguageTranslationAttributes;

export type LanguageTranslationsResponse = LanguageTranslationAttributes[];
