export type NutrientUnitAttributes = {
  id: number;
  description: string;
  symbol: string;
};

export type NutrientUnitCreationAttributes = Omit<NutrientUnitAttributes, 'id'>;
