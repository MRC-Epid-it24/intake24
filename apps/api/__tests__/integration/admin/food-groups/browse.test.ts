import { mocker, suite, setPermission } from '@intake24/api-tests/integration/helpers';
import { FoodGroup } from '@intake24/db';

export default () => {
  const url = '/api/admin/food-groups';

  beforeAll(async () => {
    await FoodGroup.create(mocker.foods.foodGroup());
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
  });

  describe('authenticated / authorized', () => {
    it('should return 200 and paginated results', async () => {
      await setPermission('food-groups|browse');

      await suite.sharedTests.assertPaginatedResult('get', url);
    });
  });
};
