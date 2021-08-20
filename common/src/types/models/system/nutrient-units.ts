export type NutrientUnitAttributes = {
  id: string;
  description: string;
  symbol: string;
};

export type NutrientUnitCreationAttributes = Omit<NutrientUnitAttributes, 'id'>;
