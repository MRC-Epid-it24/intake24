export type LocalNutrientTypeAttributes = {
  id: number;
  localeId: string;
  nutrientTypeId: number;
};

export type LocalNutrientTypeCreationAttributes = Omit<LocalNutrientTypeAttributes, 'id'>;
