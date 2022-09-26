import type { NutrientUnitAttributes, Pagination } from '../../models';

export type NutrientUnitRequest = NutrientUnitAttributes;
export type UpdateNutrientUnitRequest = Partial<Omit<NutrientUnitAttributes, 'id'>>;

export type NutrientUnitsResponse = Pagination<NutrientUnitAttributes>;

export type NutrientUnitEntry = NutrientUnitAttributes;
