import { LocaleV3 } from '@intake24/api-client-v3';

export interface FoodHeaderV3 {
  code: string;
  englishDescription: string;
  localDescription: string | null;
}

export interface CategoryHeaderV3 {
  code: string;
  englishDescription: string;
  localDescription: string | null;
  isHidden: boolean;
}

export interface AssociatedFoodWithHeaderV3 {
  foodOrCategoryHeader: [number, FoodHeaderV3 | CategoryHeaderV3];
  promptText: string;
  linkAsMain: boolean;
  genericName: string;
}
export interface InheritableAttributesV3 {
  readyMealOption: boolean[];
  sameAsBeforeOption: boolean[];
  reasonableAmount: number[];
  useInRecipes: number[];
}

export interface PortionSizeMethodParameterV3 {
  name: string;
  value: string;
}

export interface PortionSizeMethodV3 {
  method: string;
  description: string;
  imageUrl: string;
  useForRecipes: boolean;
  conversionFactor: number;
  parameters: PortionSizeMethodParameterV3[];
}

export interface MainFoodRecordV3 {
  version: string;
  code: string;
  englishDescription: string;
  groupCode: number;
  attributes: InheritableAttributesV3;
  parentCategories: CategoryHeaderV3[];
  localeRestrictions: string[];
}

export interface LocalFoodRecordV3 {
  version: string | null;
  localDescription: string | null;
  nutrientTableCodes: Record<string, string>;
  portionSize: PortionSizeMethodV3[];
  associatedFoods: AssociatedFoodWithHeaderV3[];
  brandNames: string[];
}

export interface FoodRecordV3 {
  main: MainFoodRecordV3;
  local: LocalFoodRecordV3;
}
