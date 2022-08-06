import request from 'supertest';

import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { Food, FoodGroup } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/food-groups';
  const permissions = ['food-groups', 'food-groups|delete'];

  let url: string;
  let invalidUrl: string;

  beforeAll(async () => {
    const { id } = await FoodGroup.create(mocker.foods.foodGroup());

    url = `${baseUrl}/${id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('delete', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('delete', invalidUrl);
    });

    it('should return 204 and no content', async () => {
      await suite.sharedTests.assertRecordDeleted('delete', url);
    });

    it(`should return 403 when food is assigned to food group`, async () => {
      const { id } = await FoodGroup.create(mocker.foods.foodGroup());
      await Food.create(mocker.foods.food(id));

      const { status } = await request(suite.app)
        .delete(`${baseUrl}/${id}`)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(403);
    });
  });
};
