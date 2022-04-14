import { checkSchema, Schema } from 'express-validator';
import validate from '@intake24/api/http/requests/validate';
import { defaults, surveySchemeOverrides } from './defaults';

const schema = Object.entries({ ...defaults, surveySchemeOverrides }).reduce<Schema>(
  (acc, [key, param]) => {
    const { optional, ...rest } = param;
    acc[key] = { ...rest, optional: optional ?? true };
    return acc;
  },
  {}
);

export default validate(checkSchema(schema));
