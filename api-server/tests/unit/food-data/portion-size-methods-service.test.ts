// This has to be done first because the database config is pulled indirectly by services, doing
// it during initDatabases is too late and moving helpers/databases import higher interferes with
// ESLint import ordering rules
import '../../bootstrap';

import { FoodDataService } from '@/services';
import { DbInterface } from '@/db';
import InvalidArgumentError from '@/services/foods/invalid-argument-error';
import {
  createTestData,
  generatedPortionSizeMethods,
} from '@tests/unit/food-data/portion-size-methods-test-data';
import portionSizeMethodsService, { PortionSizeMethodsService } from '@/services/foods/portion-size-methods-service';
import { enableSqlLogging, initDatabases, releaseDatabases } from '../helpers/databases';

describe('Portion size methods service', () => {
  let databases: DbInterface;
  let service: PortionSizeMethodsService;

  beforeAll(async () => {
    databases = await initDatabases();
    enableSqlLogging();
    await createTestData(databases.foods);
    service = portionSizeMethodsService();
  });

  afterAll(async () => {
    await releaseDatabases();
  });

  describe('resolvePortionSizeMethods', () => {
    // Independent locale

    it('should return portion size methods for foods that have them in the given locale', async () => {
      const methods = await service.resolvePortionSizeMethods('en_GB', 'FOOD1');
      expect(methods).toMatchObject(generatedPortionSizeMethods[0]);
    });
    it('should return portion size methods of direct parent category', async () => {
      const methods = await service.resolvePortionSizeMethods('en_GB', 'FOOD2');
      expect(methods).toMatchObject(generatedPortionSizeMethods[1]);
    });
    it('should return portion size methods of the first (ordered by id) parent category if assigned to multiple categories', async () => {
      const methods = await service.resolvePortionSizeMethods('en_GB', 'FOOD3');
      expect(methods).toMatchObject(generatedPortionSizeMethods[2]);
    });
    it('should return portion size methods of the top level category if neither the food nor direct parent have methods', async () => {
      const methods = await service.resolvePortionSizeMethods('en_GB', 'FOOD4');
      expect(methods).toMatchObject(generatedPortionSizeMethods[4]);
    });
    it('should return empty list for foods that have no portion size methods if none of their parents have any', async () => {
      const methods = await service.resolvePortionSizeMethods('en_GB', 'FOOD5');
      expect(methods).toMatchObject([]);
    });

    // With a prototype locale

    it('should return portion size methods for foods that have them in the current locale regardless of prototype locale', async () => {
      const methods = await service.resolvePortionSizeMethods('en_AU', 'FOOD5');
      expect(methods).toMatchObject(generatedPortionSizeMethods[5]);
    });
    it("should return portion size methods for foods that have them in the prototype locale if they don't have any in the current locale", async () => {
      const methods = await service.resolvePortionSizeMethods('en_AU', 'FOOD1');
      expect(methods).toMatchObject(generatedPortionSizeMethods[0]);
    });
    it(
      'should return portion size methods of direct parent category in the prototype locale ' +
        "for foods that don't have any in the current locale or in any of current locale parent categories ",
      async () => {
        const methods = await service.resolvePortionSizeMethods('en_AU', 'FOOD2');
        expect(methods).toMatchObject(generatedPortionSizeMethods[1]);
      }
    );
    it(
      'should return portion size methods of the top level category from the prototype locale' +
        ' if neither the food nor direct parent have methods in the current locale or in the prototype locale',
      async () => {
        const methods = await service.resolvePortionSizeMethods('en_AU', 'FOOD4');
        expect(methods).toMatchObject(generatedPortionSizeMethods[4]);
      }
    );
  });
});
