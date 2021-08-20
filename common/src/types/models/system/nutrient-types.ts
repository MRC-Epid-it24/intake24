export type NutrientTypeAttributes = {
  id: string;
  unitId: string;
  description: string;
};

export type NutrientTypeCreationAttributes = Omit<NutrientTypeAttributes, 'id'>;
