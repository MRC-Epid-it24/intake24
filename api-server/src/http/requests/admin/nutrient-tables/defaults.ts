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
      options: (value): boolean => {
        validateCsvMappingFields(value);
        return true;
      },
    },
  },
  csvMappingNutrients: {
    in: ['body'],
    errorMessage: 'Invalid csv mapping nutrients.',
    custom: {
      options: (value): boolean => {
        validateCsvMappingNutrients(value);
        return true;
      },
    },
  },
};

export default defaults;
