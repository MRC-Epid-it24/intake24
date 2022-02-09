import { NutrientUnitAttributes } from './nutrient-units';

export type NutrientTypeAttributes = {
  id: string;
  unitId: string;
  description: string;
};

export type NutrientTypeInKcalAttributes = {
  id: string;
  nutrientTypeId: string;
  kcalPerUnit: number;
};

export type NutrientTypeInKcalCreationAttributes = Omit<NutrientTypeInKcalAttributes, 'id'>;

export type NutrientTypeAssociations = {
  unit?: NutrientUnitAttributes;
  inKcal?: NutrientTypeInKcalAttributes;
};
