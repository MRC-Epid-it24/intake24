import { checkSchema, Schema } from 'express-validator';
import validate from '@intake24/api/http/requests/validate';
import { defaults, overrides } from './defaults';

const schema = Object.entries({ ...defaults, overrides }).reduce<Schema>((acc, [key, param]) => {
  const { optional, ...rest } = param;
  acc[key] = { ...rest, optional: optional ?? true };
  return acc;
}, {});

export default validate(checkSchema(schema));
