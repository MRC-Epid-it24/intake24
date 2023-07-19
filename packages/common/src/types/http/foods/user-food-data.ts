import type { LocaleTranslation, PortionSizeMethodId } from '../..';

// TODO: generic mapping from DB -> should use union of methods?
export interface UserPortionSizeMethodParameters {
  [name: string]: string;
}

export interface UserPortionSizeMethod {
  method: PortionSizeMethodId;
  description: string;
  imageUrl: string;
  useForRecipes: boolean;
  conversionFactor: number;
  orderBy: string;
  parameters: UserPortionSizeMethodParameters;
}

export type UserAssociatedFoodPrompt = {
  foodCode?: string;
  categoryCode?: string;
  promptText: LocaleTranslation;
  linkAsMain: boolean;
  genericName: LocaleTranslation;
};

export interface UserFoodData {
  code: string;
  englishName: string;
  localName: string;
  groupCode: string;
  kcalPer100g: number;
  reasonableAmount: number;
  readyMealOption: boolean;
  sameAsBeforeOption: boolean;
  portionSizeMethods: UserPortionSizeMethod[];
  associatedFoodPrompts: UserAssociatedFoodPrompt[];
  brandNames: string[];
  categories: string[];
}
