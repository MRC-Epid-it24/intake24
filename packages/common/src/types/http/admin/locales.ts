import type {
  LanguageAttributes,
  Pagination,
  RecipeFoodsAttributes,
  RecipeFoodsCreationAttributes,
  RecipeFoodsStepsCreationAttributes,
  SplitListAttributes,
  SplitListCreationAttributes,
  SplitWordAttributes,
  SplitWordCreationAttributes,
  SynonymSetAttributes,
  SynonymSetCreationAttributes,
  SystemLocaleAttributes,
  SystemLocaleCreationAttributes,
  UserSecurableAttributes,
} from '@intake24/db';

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
  foodIndexEnabled?: boolean;
};

export type CreateLocaleRequest = SystemLocaleCreationAttributes;

export type UpdateLocaleRequest = Omit<LocaleRequest, 'code'>;

export type LocalesResponse = Pagination<SystemLocaleAttributes>;

export interface LocaleEntry extends SystemLocaleAttributes {
  parent?: SystemLocaleAttributes;
  adminLanguage: LanguageAttributes;
  respondentLanguage: LanguageAttributes;
  owner?: Owner;
  securables?: UserSecurableAttributes[];
}

export type LocaleListEntry = Pick<
  SystemLocaleAttributes,
  'id' | 'code' | 'englishName' | 'localName' | 'countryFlagCode'
>;

export type LocaleRefs = {
  foodIndexLanguageBackends: { id: string; name: string }[];
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

export interface LocaleSynonymSetInput extends SynonymSetCreationAttributes {
  id?: string;
}
export type LocaleSynonymSet = SynonymSetAttributes;

export interface LocaleRecipeFoodsInput extends RecipeFoodsCreationAttributes {
  id?: string;
}

export interface LocaleRecipeFoodStepsInput extends RecipeFoodsStepsCreationAttributes {
  id?: string;
}

export type LocaleRecipeFoods = RecipeFoodsAttributes;

export type LocaleRecipeFoodSteps = RecipeFoodsStepsCreationAttributes;
