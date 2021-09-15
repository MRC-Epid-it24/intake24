import {
  NutrientTableRecordCreationAttributes,
  NutrientTableRecordAttributes,
} from './nutrient-table-records';
import {
  NutrientTableCsvMappingAttributes,
  NutrientTableCsvMappingCreationAttributes,
  NutrientTableCsvMappingFieldAttributes,
  NutrientTableCsvMappingNutrientAttributes,
} from './nutrient-table-csv-mappings';

export type NutrientTableAttributes = {
  id: string;
  description: string;
};

export interface NutrientTableCreationAttributes extends NutrientTableAttributes {
  records?: Omit<NutrientTableRecordCreationAttributes, 'nutrientTableId'>[];
  csvMapping?: Omit<NutrientTableCsvMappingCreationAttributes, 'nutrientTableId'>;
  csvMappingFields?: Omit<NutrientTableCsvMappingFieldAttributes, 'id ' | 'nutrientTableId'>[];
  csvMappingNutrients?: Omit<
    NutrientTableCsvMappingNutrientAttributes,
    'id ' | 'nutrientTableId'
  >[];
}

export type NutrientTableAssociations = {
  records?: NutrientTableRecordAttributes[];
  csvMapping?: NutrientTableCsvMappingAttributes;
  csvMappingFields?: NutrientTableCsvMappingFieldAttributes[];
  csvMappingNutrients?: NutrientTableCsvMappingNutrientAttributes[];
};
