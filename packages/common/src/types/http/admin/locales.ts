import type {
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
