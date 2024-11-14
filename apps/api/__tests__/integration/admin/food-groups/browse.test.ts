import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { FoodGroup } from '@intake24/db';

export default () => {
  const url = '/api/admin/food-groups';
  const permissions = ['food-groups', 'food-groups:browse'];

  beforeAll(async () => {
    await FoodGroup.create(mocker.foods.foodGroup());
  });

  it('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    it('should return 200 and paginated results', async () => {
      await suite.util.setPermission(permissions);

      await suite.sharedTests.assertPaginatedResult('get', url, { result: true });
    });
  });
};
