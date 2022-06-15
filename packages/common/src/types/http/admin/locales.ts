import type { LocaleAttributes, Pagination } from '../../models';
import type { LanguageListEntry } from './languages';

export type LocaleRequest = {
  id: string;
  englishName: string;
  localName: string;
  respondentLanguageId: string;
  adminLanguageId: string;
  countryFlagCode: string;
  prototypeLocaleId: string | null;
  textDirection: string;
};

export type CreateLocaleRequest = LocaleRequest;

export type UpdateLocaleRequest = Omit<LocaleRequest, 'id'>;

export type LocalesResponse = Pagination<LocaleAttributes>;

export type LocaleEntry = LocaleAttributes;

export type LocaleListEntry = Pick<
  LocaleAttributes,
  'id' | 'englishName' | 'localName' | 'countryFlagCode'
>;

export type LocaleRefs = {
  languages: LanguageListEntry[];
  locales: LocaleListEntry[];
};
