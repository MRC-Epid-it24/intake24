import type {
  NutrientTypeAttributes,
  NutrientTypeInKcalAttributes,
  NutrientUnitAttributes,
  Pagination,
} from '../../models';

export interface NutrientTypeRequest extends NutrientTypeAttributes {
  kcalPerUnit?: number | null;
}

export type UpdateNutrientTypeRequest = Partial<Omit<NutrientTypeRequest, 'id'>>;

export type NutrientTypesResponse = Pagination<NutrientTypeAttributes>;

export interface NutrientTypeEntry
  extends NutrientTypeAttributes,
    Partial<Pick<NutrientTypeInKcalAttributes, 'kcalPerUnit'>> {
  unit?: NutrientUnitAttributes;
}

export type NutrientTypeRefs = {
  units: NutrientUnitAttributes[];
};
