export type NutrientMappingAttributes = {
  id: number;
  nutrientTableRecordId: number;
  foodLocalId: number;
};

export type NutrientMappingCreationAttributes = Omit<NutrientMappingAttributes, 'id'>;
