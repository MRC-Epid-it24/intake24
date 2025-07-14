import {
  createTestData,
  generatedPortionSizeMethods,
} from '@intake24/api-tests/unit/food-data/portion-size-methods-test-data';
import type { PortionSizeMethodsService } from '@intake24/api/services/foods/portion-size-methods.service';
import portionSizeMethodsService from '@intake24/api/services/foods/portion-size-methods.service';

import { initDatabases, releaseDatabases } from '../helpers/databases';

export default () => {
  describe('portion size methods service', () => {
    let service: PortionSizeMethodsService;

    beforeAll(async () => {
      await initDatabases();
      await createTestData();
      service = portionSizeMethodsService('http://localhost:3000/images');
    });

    afterAll(async () => {
      await releaseDatabases();
    });

    describe('resolveUserPortionSizeMethods', () => {
      // Independent locale

      it('should return portion size methods for foods that have them in the given locale', async () => {
        const methods = await service.resolveUserPortionSizeMethods('en_GB', 'FOOD1');
        expect(methods).toMatchObject(generatedPortionSizeMethods[0]);
      });
      it('should return portion size methods of direct parent category', async () => {
        const methods = await service.resolveUserPortionSizeMethods('en_GB', 'FOOD2');
        expect(methods).toMatchObject(generatedPortionSizeMethods[1]);
      });
      it('should return portion size methods of the first (ordered by id) parent category if assigned to multiple categories', async () => {
        const methods = await service.resolveUserPortionSizeMethods('en_GB', 'FOOD3');
        expect(methods).toMatchObject(generatedPortionSizeMethods[2]);
      });
      it('should return portion size methods of the top level category if neither the food nor direct parent have methods', async () => {
        const methods = await service.resolveUserPortionSizeMethods('en_GB', 'FOOD4');
        expect(methods).toMatchObject(generatedPortionSizeMethods[4]);
      });
      it('should return empty list for foods that have no portion size methods if none of their parents have any', async () => {
        const methods = await service.resolveUserPortionSizeMethods('en_GB', 'FOOD5');
        expect(methods).toMatchObject([]);
      });
    });
  });
};
