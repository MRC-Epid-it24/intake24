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

export type LanguagesResponse = Pagination<Language>;

export type LanguageEntry = Language;

export type LanguageRefs = AnyDictionary;

export type LanguageResponse = {
  data: LanguageEntry;
  refs: LanguageRefs;
};

export type CreateLanguageResponse = Pick<LanguageResponse, 'refs'>;

export type StoreLanguageResponse = Pick<LanguageResponse, 'data'>;
