export type UserPortionSizeMethodParameters = { [name: string]: string };

export interface UserPortionSizeMethod {
  method: string;
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
