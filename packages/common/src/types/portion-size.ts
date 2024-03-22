import { z } from 'zod';

import { categoryLocaleOptionList, localeOptionList } from './common';

export const portionSizeMethods = [
  'as-served',
  'cereal',
  'direct-weight',
  'drink-scale',
  'guide-image',
  'milk-in-a-hot-drink',
  'milk-on-cereal',
  'parent-food-portion',
  'pizza',
  'recipe-builder',
  'standard-portion',
] as const;

export type PortionSizeMethodId = (typeof portionSizeMethods)[number];

export type CerealType = 'hoop' | 'flake' | 'rkris';

export const standardUnit = z.object({
  name: z.string(),
  weight: z.coerce.number(),
  omitFoodDescription: z.boolean(),
  inlineHowMany: z.string().optional(),
  inlineEstimateIn: z.string().optional(),
});

export type StandardUnit = z.infer<typeof standardUnit>;

export const asServedPortionSizeParameters = z.object({
  servingImageSet: z.string(),
  leftoversImageSet: z.string().nullish(),
});

export const cerealPortionSizeParameters = z.object({
  type: z.enum(['hoop', 'flake', 'rkris']),
  imageMapLabels: z.boolean().optional(),
});

export const drinkScalePortionSizeParameters = z.object({
  drinkwareId: z.string(),
  initialFillLevel: z.coerce.number(),
  skipFillLevel: z.boolean(),
  imageMapLabels: z.boolean().optional(),
  multiple: z.boolean().optional(),
});

export const guideImagePortionSizeParameters = z.object({
  guideImageId: z.string(),
  imageMapLabels: z.boolean().optional(),
});

export const milkInHotDrinkPortionSizeParameters = z.object({
  options: localeOptionList(z.coerce.number()),
});

export const milkOnCerealPortionSizeParameters = z.object({
  imageMapLabels: z.boolean().optional(),
});

export const parentFoodPortionParameters = z.object({
  options: categoryLocaleOptionList(z.coerce.number()),
});

export const pizzaPortionSizeParameters = z.object({
  imageMapLabels: z.boolean().optional(),
});

export const standardPortionSizeParameters = z.object({
  units: standardUnit.array(),
});

export const directWeightPortionSizeParameters = z.object({});

export const recipeBuilderPortionSizeParameters = z.object({});

export const portionSizeParameter = z.union([
  asServedPortionSizeParameters,
  cerealPortionSizeParameters,
  drinkScalePortionSizeParameters,
  guideImagePortionSizeParameters,
  milkInHotDrinkPortionSizeParameters,
  milkOnCerealPortionSizeParameters,
  parentFoodPortionParameters,
  pizzaPortionSizeParameters,
  standardPortionSizeParameters,
  directWeightPortionSizeParameters,
  recipeBuilderPortionSizeParameters,
]);

export type PortionSizeParameter = z.infer<typeof portionSizeParameter>;

export const portionSizeParameters = z.object({
  'as-served': asServedPortionSizeParameters,
  cereal: cerealPortionSizeParameters,
  'drink-scale': drinkScalePortionSizeParameters,
  'guide-image': guideImagePortionSizeParameters,
  'milk-in-a-hot-drink': milkInHotDrinkPortionSizeParameters,
  'milk-on-cereal': milkOnCerealPortionSizeParameters,
  'parent-food-portion': parentFoodPortionParameters,
  pizza: pizzaPortionSizeParameters,
  'standard-portion': standardPortionSizeParameters,
  'direct-weight': directWeightPortionSizeParameters,
  'recipe-builder': recipeBuilderPortionSizeParameters,
});

export type PortionSizeParameters = z.infer<typeof portionSizeParameters>;

export interface PortionSizeMethodBase {
  description: string;
  useForRecipes: boolean;
  conversionFactor: number;
}

export interface AsServedPsm extends PortionSizeMethodBase {
  method: 'as-served';
  parameters: PortionSizeParameters['as-served'];
}

export interface CerealPsm extends PortionSizeMethodBase {
  method: 'cereal';
  parameters: PortionSizeParameters['cereal'];
}

export interface DirectWeightPsm extends PortionSizeMethodBase {
  method: 'direct-weight';
  parameters: PortionSizeParameters['direct-weight'];
}

export interface DrinkScalePsm extends PortionSizeMethodBase {
  method: 'drink-scale';
  parameters: PortionSizeParameters['drink-scale'];
}

export interface GuideImagePsm extends PortionSizeMethodBase {
  method: 'guide-image';
  parameters: PortionSizeParameters['guide-image'];
}

export interface MilkInHotDrinkPsm extends PortionSizeMethodBase {
  method: 'milk-in-a-hot-drink';
  parameters: PortionSizeParameters['milk-in-a-hot-drink'];
}
export interface MilkOnCerealPsm extends PortionSizeMethodBase {
  method: 'milk-on-cereal';
  parameters: PortionSizeParameters['milk-on-cereal'];
}

export interface ParentFoodPsm extends PortionSizeMethodBase {
  method: 'parent-food-portion';
  parameters: PortionSizeParameters['parent-food-portion'];
}

export interface PizzaPsm extends PortionSizeMethodBase {
  method: 'pizza';
  parameters: PortionSizeParameters['pizza'];
}

export interface RecipeBuilderPsm extends PortionSizeMethodBase {
  method: 'recipe-builder';
  parameters: PortionSizeParameters['recipe-builder'];
}

export interface StandardPortionPsm extends PortionSizeMethodBase {
  method: 'standard-portion';
  parameters: PortionSizeParameters['standard-portion'];
}

export type PortionSizeMethod =
  | AsServedPsm
  | CerealPsm
  | DirectWeightPsm
  | DrinkScalePsm
  | GuideImagePsm
  | MilkInHotDrinkPsm
  | MilkOnCerealPsm
  | ParentFoodPsm
  | PizzaPsm
  | RecipeBuilderPsm
  | StandardPortionPsm;
