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
