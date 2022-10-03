import type {
  FoodIndexBackendAttributes,
  LocaleAttributes,
  Pagination,
  SplitListAttributes,
  SplitListCreationAttributes,
  SplitWordAttributes,
  SplitWordCreationAttributes,
  SynonymSetsAttributes,
  SynonymSetsCreationAttributes,
} from '../../models';
import type { LanguageListEntry } from './languages';
import type { Owner } from './users';

export type LocaleRequest = {
  code: string;
  englishName: string;
  localName: string;
  respondentLanguageId: string;
  adminLanguageId: string;
  countryFlagCode: string;
  prototypeLocaleId: string | null;
  textDirection: string;
  foodIndexLanguageBackendId: string;
};

export type CreateLocaleRequest = LocaleRequest;

export type UpdateLocaleRequest = Omit<LocaleRequest, 'code'>;

export type LocalesResponse = Pagination<LocaleAttributes>;

export interface LocaleEntry extends LocaleAttributes {
  owner?: Owner;
}

export type LocaleListEntry = Pick<
  LocaleAttributes,
  'id' | 'code' | 'englishName' | 'localName' | 'countryFlagCode'
>;

export type LocaleRefs = {
  foodIndexLanguageBackends: FoodIndexBackendAttributes[];
  languages: LanguageListEntry[];
  locales: LocaleListEntry[];
};

export interface LocaleSplitListInput extends SplitListCreationAttributes {
  id?: string;
}
export type LocaleSplitList = SplitListAttributes;

export interface LocaleSplitWordInput extends SplitWordCreationAttributes {
  id?: string;
}
export type LocaleSplitWord = SplitWordAttributes;

export interface LocaleSynonymSetInput extends SynonymSetsCreationAttributes {
  id?: string;
}
export type LocaleSynonymSet = SynonymSetsAttributes;
