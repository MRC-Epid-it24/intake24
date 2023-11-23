import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

import { associatedFoods, attributes, categories, nutrients, portionSizeMethods } from '../common';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    ...attributes,
    'main.parentCategories': categories,
    ...nutrients,
    ...portionSizeMethods,
    ...associatedFoods,
  })
);
