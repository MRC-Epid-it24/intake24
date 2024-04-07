import type { NutrientTypeRequest } from '@intake24/common/types/http/admin';
import type { FoodsNutrientType } from '@intake24/db';
import ioc from '@intake24/api/ioc';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const baseUrl = '/api/admin/nutrient-types';
  const permissions = ['nutrient-types', 'nutrient-types|edit'];

  let url: string;
  let invalidUrl: string;

  let input: NutrientTypeRequest;
  let nutrientType: FoodsNutrientType;

  beforeAll(async () => {
    input = mocker.foods.nutrientType('1', 12.5);
    nutrientType = await ioc.cradle.nutrientTypeService.createNutrientType(input);

    url = `${baseUrl}/${nutrientType.id}/edit`;
    invalidUrl = `${baseUrl}/999999/edit`;
  });

  it('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('get', invalidUrl);
    });

    it('should return 200 and data', async () => {
      await suite.sharedTests.assertRecord('get', url, input);
    });
  });
};
