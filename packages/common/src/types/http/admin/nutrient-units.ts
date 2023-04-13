import type { Pagination, SystemNutrientUnitAttributes } from '@intake24/db';

export type NutrientUnitRequest = SystemNutrientUnitAttributes;
export type UpdateNutrientUnitRequest = Partial<Omit<SystemNutrientUnitAttributes, 'id'>>;

export type NutrientUnitsResponse = Pagination<SystemNutrientUnitAttributes>;

export type NutrientUnitEntry = SystemNutrientUnitAttributes;
