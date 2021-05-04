import type { PortionSizeMethodId } from '../../models';

export type UserPortionSizeMethodParameters = { [name: string]: string };

export interface AsServedParameters {
  'serving-image-set': string;
  'leftovers-image-set': string;
}

export interface GuideImageParameters {
  'guide-image-id': string;
}

export interface UserPortionSizeMethod {
  method: PortionSizeMethodId;
  description: string;
  imageUrl: string;
  useForRecipes: boolean;
  conversionFactor: number;
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
  englishDescription: string;
  localDescription: string;
  groupCode: number;
  kcalPer100g: number;
  reasonableAmount: number;
  readyMealOption: boolean;
  sameAsBeforeOption: boolean;
  portionSizeMethods: UserPortionSizeMethod[];
  associatedFoodPrompts: UserAssociatedFoodPrompt[];
  brandNames: string[];
}
