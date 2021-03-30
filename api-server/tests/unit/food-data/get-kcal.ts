import { FoodDataService, foodDataService } from '@/services';
import { DbInterface } from '@/db';
import InvalidArgumentError from '@/services/foods/invalid-argument-error';
import createTestData from '@tests/unit/food-data/get-kcal-test-data';
import createLocales from './test-data-locales';
import { initDatabases, releaseDatabases } from '../helpers/databases';

export default () => {
  describe('getNutrientKCalPer100G', () => {
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
};
