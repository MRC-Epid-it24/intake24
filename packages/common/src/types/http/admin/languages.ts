import type {
  LanguageAttributes,
  LanguageCreationAttributes,
  LanguageTranslationAttributes,
  Pagination,
} from '../../models';
import type { Owner } from './users';

export type LanguageRequest = LanguageCreationAttributes;

export type CreateLanguageRequest = LanguageRequest;

export type UpdateLanguageRequest = Omit<LanguageRequest, 'code'>;

export type LanguagesResponse = Pagination<LanguageAttributes>;

export interface LanguageEntry extends LanguageAttributes {
  owner?: Owner;
}

export type LanguageListEntry = Pick<
  LanguageAttributes,
  'id' | 'code' | 'englishName' | 'localName' | 'countryFlagCode'
>;

export type LanguageTranslationEntry = LanguageTranslationAttributes;

export type LanguageTranslationsResponse = LanguageTranslationAttributes[];
