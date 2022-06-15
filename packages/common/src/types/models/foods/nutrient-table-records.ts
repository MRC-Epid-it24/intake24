import type { OmitAndOptional } from '../model';

export type NutrientTableRecordNutrientAttributes = {
  id: string;
  nutrientTableRecordId: string;
  nutrientTypeId: string;
  unitsPer100g: number;
};

export type NutrientTableRecordNutrientCreationAttributes = Omit<
  NutrientTableRecordNutrientAttributes,
  'id'
>;

export type NutrientTableRecordFieldAttributes = {
  id: string;
  nutrientTableRecordId: string;
  name: string;
  value: string;
};

export type NutrientTableRecordFieldCreationAttributes = Omit<
  NutrientTableRecordFieldAttributes,
  'id'
>;

export type NutrientTableRecordAttributes = {
  id: string;
  nutrientTableId: string;
  nutrientTableRecordId: string;
  name: string;
  localName: string | null;
};

export interface NutrientTableRecordCreationAttributes
  extends OmitAndOptional<NutrientTableRecordAttributes, 'id', 'localName'> {
  fields?: Omit<NutrientTableRecordFieldCreationAttributes, 'nutrientTableRecordId'>[];
  nutrients?: Omit<NutrientTableRecordNutrientCreationAttributes, 'nutrientTableRecordId'>[];
}
