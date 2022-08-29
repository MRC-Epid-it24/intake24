import type { Schema } from 'express-validator';

import type {
  NutrientTableCsvMappingFieldInput,
  NutrientTableCsvMappingNutrientInput,
} from '@intake24/common/types/http/admin';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { validateCsvMappingFields, validateCsvMappingNutrients } from '@intake24/common/validators';

const defaults: Schema = {
  description: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    isEmpty: { negated: true },
  },
  'csvMapping.rowOffset': {
    in: ['body'],
    errorMessage: typeErrorMessage('int._'),
    isInt: true,
    toInt: true,
  },
  'csvMapping.idColumnOffset': {
    in: ['body'],
    errorMessage: typeErrorMessage('int._'),
    isInt: true,
    toInt: true,
  },
  'csvMapping.descriptionColumnOffset': {
    in: ['body'],
    errorMessage: typeErrorMessage('int._'),
    isInt: true,
    toInt: true,
  },
  'csvMapping.localDescriptionColumnOffset': {
    in: ['body'],
    errorMessage: typeErrorMessage('int._'),
    isInt: true,
    toInt: true,
    optional: { options: { nullable: true } },
  },
  csvMappingFields: {
    in: ['body'],
    errorMessage: typeErrorMessage('structure._'),
    custom: {
      options: (value: NutrientTableCsvMappingFieldInput[], meta): boolean => {
        validateCsvMappingFields(value);

        const fieldNames = value.map((field) => field.fieldName);

        const noDups = [...new Set(fieldNames)];
        if (fieldNames.length !== noDups.length)
          throw new Error(customTypeErrorMessage('duplicate._', meta));

        return true;
      },
    },
  },
  csvMappingNutrients: {
    in: ['body'],
    errorMessage: typeErrorMessage('structure._'),
    custom: {
      options: (value: NutrientTableCsvMappingNutrientInput[], meta): boolean => {
        validateCsvMappingNutrients(value);

        const nutrientTypeIds = value.map((nutrient) => nutrient.nutrientTypeId);

        const noDups = [...new Set(nutrientTypeIds)];
        if (nutrientTypeIds.length !== noDups.length)
          throw new Error(customTypeErrorMessage('duplicate._', meta));

        return true;
      },
    },
  },
};

export default defaults;
