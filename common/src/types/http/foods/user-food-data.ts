export type PortionSizeMethod =
  | 'as-served'
  | 'guide-image'
  | 'drink-scale'
  | 'standard-portion'
  | 'cereal'
  | 'milk-on-cereal'
  | 'pizza'
  | 'milk-in-a-hot-drink'
  | 'weight';

export type UserPortionSizeMethodParameters = { [name: string]: string };

export interface AsServedParameters {
  'serving-image-set': string;
  'leftovers-image-set': string;
}

export interface UserPortionSizeMethod {
  method: PortionSizeMethod;
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
