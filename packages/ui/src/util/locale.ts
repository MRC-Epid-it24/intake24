import type { NutrientType } from '@intake24/common/types/http';

export function getNutrientUnit(group: string[], nutrientTypes: NutrientType[]): string {
  const nt = nutrientTypes.filter(item => group.includes(item.id));
  if (nt.length !== group.length)
    throw new Error(`Invalid nutrient types (${group}) defined in feedback top foods.`);

  if (nt.some(item => item.unit !== nt[0].unit))
    throw new Error('All nutrient types must have the same unit.');

  return nt[0].unit;
}
