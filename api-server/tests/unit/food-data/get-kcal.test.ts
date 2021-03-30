// This has to be done first because the database config is pulled indirectly by services, doing
// it during initDatabases is too late and moving helpers/databases import higher interferes with
// ESLint import ordering rules
import '../../bootstrap';

import { FoodDataService, foodDataService } from '@/services';
import { DbInterface } from '@/db';
import InvalidArgumentError from '@/services/foods/invalid-argument-error';
import createTestData from '@tests/unit/food-data/get-kcal-test-data';
import createLocales from './test-data-locales';
import { enableSqlLogging, initDatabases, releaseDatabases } from '../helpers/databases';

describe('Food data service', () => {
  let databases: DbInterface;
  let service: FoodDataService;

  beforeAll(async () => {
    databases = await initDatabases();
    service = foodDataService();
    await createLocales();
    await createTestData(databases.foods);
  });

  afterAll(async () => {
    await releaseDatabases();
  });

  describe('getNutrientKCalPer100G', () => {
    it('should throw InvalidArgumentError for unknown food IDs', async () => {
      const promise = service.getNutrientKCalPer100G('en_GB', 'BAD_FOOD');
      await expect(promise).rejects.toThrow(InvalidArgumentError);
    });

    it('should throw InvalidArgumentError for unknown locale IDs', async () => {
      const promise = service.getNutrientKCalPer100G('bad_locale', 'TEST1');
      await expect(promise).rejects.toThrow(InvalidArgumentError);
    });

    it('should return correct kcal value for valid food and locale IDs', async () => {
      const kcal = await service.getNutrientKCalPer100G('en_GB', 'FOOD1');
      expect(kcal).toBe(100);
    });
  });
});
