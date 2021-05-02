export type NutrientTypeAttributes = {
  id: number;
  unitId: number;
  description: string;
};

export type NutrientTypeCreationAttributes = Omit<NutrientTypeAttributes, 'id'>;
