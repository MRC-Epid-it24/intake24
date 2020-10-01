import { AnyDictionary } from '../../common';
import { Language } from '../../models/system';
import { Pagination } from '../../models/pagination';

export type LanguageRequest = {
  id: string;
  englishName: string;
  localName: string;
  countryFlagCode: string;
};

export type CreateLanguageRequest = LanguageRequest;

export type UpdateLanguageRequest = Omit<LanguageRequest, 'id'>;

export type LanguageListResponse = Pagination<Language>;

export type LanguageEntryResponse = {
  data: Language;
  refs: AnyDictionary;
};

export type LanguageCreateResponse = Pick<LanguageEntryResponse, 'refs'>;

export type LanguageStoreResponse = Pick<LanguageEntryResponse, 'data'>;
