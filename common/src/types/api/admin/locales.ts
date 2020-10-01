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

export type LocaleListResponse = Pagination<Locale>;

export type LocaleEntryRefs = {
  languages: Pick<Language, 'id' | 'englishName' | 'localName' | 'countryFlagCode'>[];
  locales: Pick<Locale, 'id' | 'englishName' | 'localName' | 'countryFlagCode'>[];
};

export type LocaleEntryResponse = {
  data: Locale;
  refs: LocaleEntryRefs;
};

export type LocaleCreateResponse = Pick<LocaleEntryResponse, 'refs'>;

export type LocaleStoreResponse = Pick<LocaleEntryResponse, 'data'>;
