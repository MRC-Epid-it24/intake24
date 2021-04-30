import { FoodDataService, foodDataService } from '@/services';
import { DbInterface } from '@/db';
import InvalidIdError from '@/services/foods/invalid-id-error';
import createTestData from '@tests/unit/food-data/get-kcal-test-data';
import createLocales from './test-data-locales';
import { initDatabases, releaseDatabases } from '../helpers/databases';

export default () => {
  describe('getNutrientKCalPer100G', () => {
    let databases: DbInterface;
    let service: FoodDataService;

    beforeAll(async () => {
      databases = await initDatabases();
      service = foodDataService({ imagesBaseUrl: 'https://localhost' });
      await createLocales();
      await createTestData(databases.foods);
    });

    afterAll(async () => {
      await releaseDatabases();
    });

    it('should throw InvalidIdError for unknown food IDs', async () => {
      const promise = service.getNutrientKCalPer100G('en_GB', 'BAD_FOOD');
      await expect(promise).rejects.toThrow(InvalidIdError);
    });

    it('should throw InvalidIdError for unknown locale IDs', async () => {
      const promise = service.getNutrientKCalPer100G('bad_locale', 'TEST1');
      await expect(promise).rejects.toThrow(InvalidIdError);
    });

    it('should return correct kcal value for valid food and locale IDs', async () => {
      const kcal = await service.getNutrientKCalPer100G('en_GB', 'FOOD1');
      expect(kcal).toBe(100);
    });
  });
};
