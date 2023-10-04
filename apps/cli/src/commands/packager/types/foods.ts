export interface PkgInheritableAttributes {
  readyMealOption?: boolean;
  sameAsBeforeOption?: boolean;
  reasonableAmount?: number;
  useInRecipes?: number;
}

export interface PkgGlobalFood {
  version: string;
  code: string;
  englishDescription: string;
  groupCode: number;
  attributes: PkgInheritableAttributes;
  parentCategories: string[];
}

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

export type PkgPortionSizeMethodType = (typeof PortionSizeMethodTypes)[number];

export interface PkgPortionSizeMethodBase {
  method: PkgPortionSizeMethodType;
  description: string;
  useForRecipes: boolean;
  conversionFactor: number;
}

export interface PkgAsServedPsm extends PkgPortionSizeMethodBase {
  method: 'as-served';
  servingImageSet: string;
  leftoversImageSet?: string;
}

export interface PkgGuideImagePsm extends PkgPortionSizeMethodBase {
  method: 'guide-image';
  guideImageId: string;
}

export interface PkgDrinkScalePsm extends PkgPortionSizeMethodBase {
  method: 'drink-scale';
  drinkwareId: string;
  initialFillLevel: number;
  skipFillLevel: boolean;
}

export interface PkgStandardUnit {
  name: string;
  weight: number;
  omitFoodDescription: boolean;
}

export interface PkgStandardPortionPsm extends PkgPortionSizeMethodBase {
  method: 'standard-portion';
  units: PkgStandardUnit[];
}

export interface PkgCerealPsm extends PkgPortionSizeMethodBase {
  method: 'cereal';
  type: string;
}

export interface PkgPizzaPsm extends PkgPortionSizeMethodBase {
  method: 'pizza';
}

export interface PkgMilkOnCerealPsm extends PkgPortionSizeMethodBase {
  method: 'milk-on-cereal';
}

export interface PkgMilkInHotDrinkPsm extends PkgPortionSizeMethodBase {
  method: 'milk-in-a-hot-drink';
}

export type PkgPortionSizeMethod =
  | PkgAsServedPsm
  | PkgGuideImagePsm
  | PkgDrinkScalePsm
  | PkgStandardPortionPsm
  | PkgCerealPsm
  | PkgMilkOnCerealPsm
  | PkgPizzaPsm
  | PkgMilkInHotDrinkPsm;

export interface PkgAssociatedFood {
  foodCode?: string;
  categoryCode?: string;
  promptText: string;
  linkAsMain: boolean;
  genericName: string;
}

export interface PkgLocalFood {
  code: string;
  version?: string;
  localDescription?: string;
  nutrientTableCodes: Record<string, string>;
  portionSize: PkgPortionSizeMethod[];
  associatedFoods: PkgAssociatedFood[];
  brandNames: string[];
}
