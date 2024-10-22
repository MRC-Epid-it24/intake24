/* eslint-disable perfectionist/sort-imports */
import '@intake24/api/bootstrap';

import getKcalTests from './get-kcal';

import helpersTests from './helpers';
import portionSizeMethodsServiceTests from './portion-size-methods-service';

describe('food data service', () => {
  helpersTests();
  getKcalTests();
  portionSizeMethodsServiceTests();
});
