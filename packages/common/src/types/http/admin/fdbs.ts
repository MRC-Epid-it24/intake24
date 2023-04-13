import type { FoodsLocaleAttributes, NutrientTableAttributes } from '@intake24/db';

export type FoodDatabaseEntry = FoodsLocaleAttributes;

export type FoodDatabaseRefs = {
  nutrientTables: NutrientTableAttributes[];
};
