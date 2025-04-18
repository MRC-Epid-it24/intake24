import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import type { FoodGroupCreationAttributes } from '@intake24/db';
import { FoodGroup } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/food-groups';
  const permissions = ['food-groups', 'food-groups:read'];

  let url: string;
  let invalidUrl: string;

  let input: FoodGroupCreationAttributes;
  let output: FoodGroupCreationAttributes;
  let foodGroup: FoodGroup;

  beforeAll(async () => {
    input = mocker.foods.foodGroup();
    foodGroup = await FoodGroup.create(input);
    output = { ...input };

    url = `${baseUrl}/${foodGroup.id}`;
    invalidUrl = `${baseUrl}/999999`;
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
      await suite.sharedTests.assertRecord('get', url, output);
    });
  });
};
