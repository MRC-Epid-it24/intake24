import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

import {
  associatedFoods,
  attributes,
  categories,
  locales,
  nutrients,
  portionSizeMethods,
} from '../common';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    ...attributes,
    'main.parentCategories': categories,
    'main.locales': locales,
    ...nutrients,
    ...portionSizeMethods,
    ...associatedFoods,
  })
);
