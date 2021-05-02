export type NutrientTypeAttributes = {
  id: number;
  description: string;
  unitId: number;
};

export type NutrientTypeCreationAttributes = Omit<NutrientTypeAttributes, 'id'>;
