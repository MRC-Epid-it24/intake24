import type { Schema } from 'express-validator';
import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

import { visibility } from '../generic';
import { defaults, name } from './defaults';

const optionalDefaults = Object.entries({ ...defaults, visibility }).reduce<Schema>(
  (acc, [key, param]) => {
    const { optional, ...rest } = param;
    acc[key] = { ...rest, optional: optional ?? true };
    return acc;
  },
  {}
);

export default validate(checkSchema({ ...optionalDefaults, name }));
