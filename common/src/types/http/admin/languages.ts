import { Dictionary } from '../..';
import { LanguageAttributes, Pagination } from '../../models';

export type LanguageRequest = {
  id: string;
  englishName: string;
  localName: string;
  countryFlagCode: string;
  textDirection: string;
};

export type CreateLanguageRequest = LanguageRequest;

export type UpdateLanguageRequest = Omit<LanguageRequest, 'id'>;

export type LanguagesResponse = Pagination<LanguageAttributes>;

export type LanguageEntry = LanguageAttributes;

export type LanguageRefs = Dictionary;

export type LanguageResponse = {
  data: LanguageEntry;
  refs: LanguageRefs;
};

export type CreateLanguageResponse = Pick<LanguageResponse, 'refs'>;

export type StoreLanguageResponse = Pick<LanguageResponse, 'data'>;
