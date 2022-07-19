import type { LocaleAttributes, NutrientTableAttributes } from '../../models';

export type FoodDatabaseEntry = LocaleAttributes;

export type FoodDatabaseRefs = {
  nutrientTables: NutrientTableAttributes[];
};
