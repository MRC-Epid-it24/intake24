import {
  NutrientTableAssociations,
  NutrientTableAttributes,
  NutrientTableCsvMappingAttributes,
  NutrientTableCsvMappingFieldAttributes,
  NutrientTableCsvMappingNutrientAttributes,
  NutrientTypeAttributes,
  Pagination,
} from '../../models';

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
  nutrients: NutrientTypeAttributes[];
};

export type NutrientTableResponse = {
  data: NutrientTableEntry;
  refs: NutrientTableRefs;
};

export type CreateNutrientTableResponse = Pick<NutrientTableResponse, 'refs'>;

export type StoreNutrientTableResponse = Pick<NutrientTableResponse, 'data'>;
