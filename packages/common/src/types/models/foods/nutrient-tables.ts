import type {
  NutrientTableCsvMappingAttributes,
  NutrientTableCsvMappingCreationAttributes,
  NutrientTableCsvMappingFieldAttributes,
  NutrientTableCsvMappingNutrientAttributes,
} from './nutrient-table-csv-mappings';
import type {
  NutrientTableRecordAttributes,
  NutrientTableRecordCreationAttributes,
} from './nutrient-table-records';

export type NutrientTableAttributes = {
  id: string;
  description: string;
};

export interface NutrientTableCreationAttributes extends NutrientTableAttributes {
  records?: Omit<NutrientTableRecordCreationAttributes, 'nutrientTableId'>[];
  csvMapping?: Omit<NutrientTableCsvMappingCreationAttributes, 'nutrientTableId'>;
  csvMappingFields?: Omit<NutrientTableCsvMappingFieldAttributes, 'id' | 'nutrientTableId'>[];
  csvMappingNutrients?: Omit<NutrientTableCsvMappingNutrientAttributes, 'id' | 'nutrientTableId'>[];
}

export type NutrientTableAssociations = {
  records?: NutrientTableRecordAttributes[];
  csvMapping?: NutrientTableCsvMappingAttributes;
  csvMappingFields?: NutrientTableCsvMappingFieldAttributes[];
  csvMappingNutrients?: NutrientTableCsvMappingNutrientAttributes[];
};
