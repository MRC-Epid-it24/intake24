export const PortionSizeMethodTypes = [
  'as-served',
  'guide-image',
  'drink-scale',
  'standard-portion',
  'cereal',
  'milk-on-cereal',
  'pizza',
  'milk-in-a-hot-drink',
] as const;

export type PortionSizeMethodType = (typeof PortionSizeMethodTypes)[number];

export interface PortionSizeMethodBase {
  method: PortionSizeMethodType;
  description: string;
  useForRecipes: boolean;
  conversionFactor: number;
}

export interface AsServedPsm extends PortionSizeMethodBase {
  method: 'as-served';
  servingImageSet: string;
  leftoversImageSet?: string;
}

export interface GuideImagePsm extends PortionSizeMethodBase {
  method: 'guide-image';
  guideImageId: string;
}

export interface DrinkScalePsm extends PortionSizeMethodBase {
  method: 'drink-scale';
  drinkwareId: string;
  initialFillLevel: number;
  skipFillLevel: boolean;
}

export interface StandardUnit {
  name: string;
  weight: number;
  omitFoodDescription: boolean;
}

export interface StandardPortionPsm extends PortionSizeMethodBase {
  method: 'standard-portion';
  units: StandardUnit[];
}

export interface CerealPsm extends PortionSizeMethodBase {
  method: 'cereal';
  type: string;
}

export interface PizzaPsm extends PortionSizeMethodBase {
  method: 'pizza';
}

export interface MilkOnCerealPsm extends PortionSizeMethodBase {
  method: 'milk-on-cereal';
}

export interface MilkInHotDrinkPsm extends PortionSizeMethodBase {
  method: 'milk-in-a-hot-drink';
}

export type PortionSizeMethod =
  | AsServedPsm
  | GuideImagePsm
  | DrinkScalePsm
  | StandardPortionPsm
  | CerealPsm
  | MilkOnCerealPsm
  | PizzaPsm
  | MilkInHotDrinkPsm;
