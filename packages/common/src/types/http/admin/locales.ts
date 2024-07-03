import { z } from 'zod';

import type {
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
  SystemLocaleCreationAttributes,
} from '@intake24/db';
import { recordVisibilities } from '@intake24/common/security';

import { type TextDirection, textDirections } from '../../common';
import { languageAttributes } from './languages';
import { userSecurableAttributes } from './securables';
import { owner } from './users';

export type LocaleRequest = {
  code: string;
  englishName: string;
  localName: string;
  respondentLanguageId: string;
  adminLanguageId: string;
  countryFlagCode: string;
  prototypeLocaleId: string | null;
  textDirection: TextDirection;
  foodIndexLanguageBackendId: string;
  foodIndexEnabled?: boolean;
};

export const systemLocaleAttributes = z.object({
  id: z.string(),
  code: z.string().min(1).max(16),
  englishName: z.string().min(1).max(64),
  localName: z.string().min(1).max(64),
  respondentLanguageId: z.string().min(1).max(16),
  adminLanguageId: z.string().min(1).max(16),
  countryFlagCode: z.string().min(1).max(16),
  prototypeLocaleId: z.string().min(1).max(16).nullable(),
  textDirection: z.enum(textDirections),
  foodIndexEnabled: z.boolean(),
  foodIndexLanguageBackendId: z.string().min(1).max(16),
  ownerId: z.string().nullable(),
  visibility: z.enum(recordVisibilities),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SystemLocaleAttributes = z.infer<typeof systemLocaleAttributes>;

export type CreateLocaleRequest = SystemLocaleCreationAttributes;

export type UpdateLocaleRequest = Omit<LocaleRequest, 'code'>;

export type LocalesResponse = Pagination<SystemLocaleAttributes>;

export const localeEntry = systemLocaleAttributes.extend({
  parent: systemLocaleAttributes.optional(),
  adminLanguage: languageAttributes.optional(),
  respondentLanguage: languageAttributes.optional(),
  owner: owner.optional(),
  securables: userSecurableAttributes.array().optional(),
});

export type LocaleEntry = z.infer<typeof localeEntry>;

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
