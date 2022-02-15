import {
  NutrientTableAssociations,
  NutrientTableAttributes,
  NutrientTableCsvMappingAttributes,
  NutrientTableCsvMappingFieldAttributes,
  NutrientTableCsvMappingNutrientAttributes,
  Pagination,
} from '../../models';
import { NutrientTypeEntry } from './nutrient-types';

export type NutrientTableCsvMappingInput = Omit<
  NutrientTableCsvMappingAttributes,
  'nutrientTableId'
>;

export type NutrientTableCsvMappingFieldInput = Omit<
  NutrientTableCsvMappingFieldAttributes,
  'id' | 'nutrientTableId'
>;

export type NutrientTableCsvMappingFieldsInput = NutrientTableCsvMappingFieldInput[];

export type NutrientTableCsvMappingNutrientInput = Omit<
  NutrientTableCsvMappingNutrientAttributes,
  'id' | 'nutrientTableId'
>;

export type NutrientTableCsvMappingNutrientsInput = NutrientTableCsvMappingNutrientInput[];

export interface NutrientTableInput extends NutrientTableAttributes {
  csvMapping: NutrientTableCsvMappingInput;
  csvMappingFields: NutrientTableCsvMappingFieldsInput;
  csvMappingNutrients: NutrientTableCsvMappingNutrientsInput;
}

export type NutrientTablesResponse = Pagination<NutrientTableAttributes>;

export type NutrientTableEntry = NutrientTableAttributes &
  Required<
    Pick<NutrientTableAssociations, 'csvMapping' | 'csvMappingFields' | 'csvMappingNutrients'>
  >;

export type NutrientTableRefs = {
  nutrientTypes: NutrientTypeEntry[];
};
