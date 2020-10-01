import { Language, Locale } from '../../models/system';
import { Pagination } from '../../models/pagination';

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

export type LocalesResponse = Pagination<Language>;

export type LocaleEntry = Locale;

export type LocaleRefs = {
  languages: Language[];
  locales: Locale[];
};

export type LocaleResponse = {
  data: LocaleEntry;
  refs: LocaleRefs;
};

export type CreateLocaleResponse = Pick<LocaleResponse, 'refs'>;

export type StoreLocaleResponse = Pick<LocaleResponse, 'data'>;
