import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import type { FoodGroupCreationAttributes } from '@intake24/db';

export default () => {
  const url = '/api/admin/food-groups';
  const permissions = ['food-groups', 'food-groups:create'];

  let input: FoodGroupCreationAttributes;
  let output: FoodGroupCreationAttributes;

  beforeAll(async () => {
    input = mocker.foods.foodGroup();
    output = { ...input };
  });

  it('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 400 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['name']);
    });

    it('should return 400 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['name'], {
        input: { name: { key: 'name' } },
      });
    });

    it('should return 201 and new resource', async () => {
      await suite.sharedTests.assertRecordInserted('post', url, output, { input });
    });

    it('should return 400 for duplicate name', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['name'], {
        input: { name: input.name },
      });
    });
  });
};
