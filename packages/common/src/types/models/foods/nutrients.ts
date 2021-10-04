export type NutrientMappingAttributes = {
  id: string;
  nutrientTableRecordId: string;
  foodLocalId: string;
};

export type NutrientMappingCreationAttributes = Omit<NutrientMappingAttributes, 'id'>;
