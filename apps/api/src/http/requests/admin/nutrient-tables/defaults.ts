import {
  NutrientTableCsvMappingFieldInput,
  NutrientTableCsvMappingNutrientInput,
} from '@intake24/common/types/http/admin';
import { validateCsvMappingFields, validateCsvMappingNutrients } from '@intake24/common/validators';
import type { Schema } from 'express-validator';

const defaults: Schema = {
  description: {
    in: ['body'],
    errorMessage: 'Enter a description.',
    isString: true,
    isEmpty: { negated: true },
  },
  'csvMapping.rowOffset': {
    in: ['body'],
    errorMessage: 'Value must be a number.',
    isInt: true,
    toInt: true,
  },
  'csvMapping.idColumnOffset': {
    in: ['body'],
    errorMessage: 'Value must be a number.',
    isInt: true,
    toInt: true,
  },
  'csvMapping.descriptionColumnOffset': {
    in: ['body'],
    errorMessage: 'Value must be a number.',
    isInt: true,
    toInt: true,
  },
  'csvMapping.localDescriptionColumnOffset': {
    in: ['body'],
    errorMessage: 'Value must be a number.',
    isInt: true,
    toInt: true,
    optional: { options: { nullable: true } },
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
