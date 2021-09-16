import {
  NutrientTableCsvMappingFieldInput,
  NutrientTableCsvMappingNutrientInput,
} from '@common/types/http/admin';
import {
  validateCsvMapping,
  validateCsvMappingFields,
  validateCsvMappingNutrients,
} from '@common/validators';
import { Schema } from 'express-validator';

const defaults: Schema = {
  description: {
    in: ['body'],
    errorMessage: 'Enter a description.',
    isString: true,
    isEmpty: { negated: true },
  },
  csvMapping: {
    in: ['body'],
    errorMessage: 'Invalid csv mappings.',
    custom: {
      options: (value): boolean => {
        validateCsvMapping(value);
        return true;
      },
    },
  },
  csvMappingFields: {
    in: ['body'],
    errorMessage: 'Invalid csv mapping fields.',
    custom: {
      options: (fields: NutrientTableCsvMappingFieldInput[]): boolean => {
        validateCsvMappingFields(fields);

        const fieldNames = fields.map((field) => field.fieldName);

        const noDups = [...new Set(fieldNames)];
        if (fieldNames.length !== noDups.length) throw new Error('Duplicate field names.');

        return true;
      },
    },
  },
  csvMappingNutrients: {
    in: ['body'],
    errorMessage: 'Invalid csv mapping nutrients.',
    custom: {
      options: (nutrients: NutrientTableCsvMappingNutrientInput[]): boolean => {
        validateCsvMappingNutrients(nutrients);

        const nutrientTypeIds = nutrients.map((nutrient) => nutrient.nutrientTypeId);

        const noDups = [...new Set(nutrientTypeIds)];
        if (nutrientTypeIds.length !== noDups.length) throw new Error('Duplicate nutrients.');

        return true;
      },
    },
  },
};

export default defaults;
