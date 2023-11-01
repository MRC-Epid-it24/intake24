import type {
  NutrientTableAttributes,
  NutrientTableCsvMappingAttributes,
  NutrientTableCsvMappingFieldAttributes,
  NutrientTableCsvMappingNutrientAttributes,
  NutrientTableRecordAttributes,
  Pagination,
} from '@intake24/db';

import type { NutrientTypeEntry } from './nutrient-types';

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

export type NutrientTableEntry = NutrientTableAttributes & {
  csvMapping: NutrientTableCsvMappingAttributes;
  csvMappingFields: NutrientTableCsvMappingFieldAttributes[];
  csvMappingNutrients: NutrientTableCsvMappingNutrientAttributes[];
};

export type NutrientTableRefs = {
  nutrientTypes: NutrientTypeEntry[];
};

export type NutrientTableRecord = {
  recordId: string;
  name: string;
  localName?: string;
  nutrients: [string, number][];
  fields: [string, string][];
};

export type UpdateNutrientTableRecordsRequest = {
  records: NutrientTableRecord[];
};

export type NutrientTableRecordsResponse = Pagination<NutrientTableRecordAttributes>;
