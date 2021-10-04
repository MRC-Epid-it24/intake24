import { Optional } from '../model';

export type NutrientTableCsvMappingAttributes = {
  nutrientTableId: string;
  rowOffset: number;
  idColumnOffset: number;
  descriptionColumnOffset: number;
  localDescriptionColumnOffset: number | null;
};

export type NutrientTableCsvMappingCreationAttributes = Optional<
  NutrientTableCsvMappingAttributes,
  'localDescriptionColumnOffset'
>;

export type NutrientTableCsvMappingFieldAttributes = {
  id: string;
  nutrientTableId: string;
  fieldName: string;
  columnOffset: number;
};

export type NutrientTableCsvMappingFieldCreationAttributes = Omit<
  NutrientTableCsvMappingFieldAttributes,
  'id'
>;

export type NutrientTableCsvMappingNutrientAttributes = {
  id: string;
  nutrientTableId: string;
  nutrientTypeId: string;
  columnOffset: number;
};

export type NutrientTableCsvMappingNutrientCreationAttributes = Omit<
  NutrientTableCsvMappingNutrientAttributes,
  'id'
>;
