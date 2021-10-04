import { LocaleAttributes, Pagination } from '../../models';
import { LanguageEntry } from './languages';

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

export type LocaleRefs = {
  languages: LanguageEntry[];
  locales: LocaleEntry[];
};

export type LocaleResponse = {
  data: LocaleEntry;
  refs: LocaleRefs;
};

export type CreateLocaleResponse = Pick<LocaleResponse, 'refs'>;

export type StoreLocaleResponse = Pick<LocaleResponse, 'data'>;
