import type { NutrientTypeEntry } from '@intake24/common/types/http/admin';
import type { FoodsNutrientType } from '@intake24/db';

export const toNutrientTypeResponse = (nutrientType: FoodsNutrientType): NutrientTypeEntry => {
  const { id, description, unitId, unit, inKcal } = nutrientType;
  return { id, description, unitId, unit, kcalPerUnit: inKcal?.kcalPerUnit };
};
