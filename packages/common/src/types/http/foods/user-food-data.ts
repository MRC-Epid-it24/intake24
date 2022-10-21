import type { PortionSizeMethodId } from '../..';

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
  foodCode: string | undefined;
  categoryCode: string | undefined;
  promptText: string;
  linkAsMain: boolean;
  genericName: string;
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
