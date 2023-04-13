import type {
  NutrientTypeInKcalAttributes,
  Pagination,
  SystemNutrientTypeAttributes,
  SystemNutrientUnitAttributes,
} from '@intake24/db';

export interface NutrientTypeRequest extends SystemNutrientTypeAttributes {
  kcalPerUnit?: number | null;
}

export type UpdateNutrientTypeRequest = Partial<Omit<NutrientTypeRequest, 'id'>>;

export type NutrientTypesResponse = Pagination<SystemNutrientTypeAttributes>;

export interface NutrientTypeEntry
  extends SystemNutrientTypeAttributes,
    Partial<Pick<NutrientTypeInKcalAttributes, 'kcalPerUnit'>> {
  unit?: SystemNutrientUnitAttributes;
}

export type NutrientTypeRefs = {
  units: SystemNutrientUnitAttributes[];
};
