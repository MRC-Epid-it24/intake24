import type { FoodGroupCreationAttributes } from '@intake24/common/types/models';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { FoodGroup } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/food-groups';
  const permissions = ['food-groups', 'food-groups|edit'];

  let url: string;
  let invalidUrl: string;

  let input: FoodGroupCreationAttributes;
  let updateInput: FoodGroupCreationAttributes;
  let output: FoodGroupCreationAttributes;
  let foodGroup: FoodGroup;

  beforeAll(async () => {
    input = mocker.foods.foodGroup();
    updateInput = mocker.foods.foodGroup();

    output = { ...updateInput };

    foodGroup = await FoodGroup.create(input);

    url = `${baseUrl}/${foodGroup.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('put', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('put', url, ['name']);
    });

    it('should return 422 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput('put', url, ['name'], {
        input: { name: { name: 'Food group' } },
      });
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('put', invalidUrl, { input: updateInput });
    });

    it('should return 200 and data', async () => {
      await suite.sharedTests.assertRecordUpdated('put', url, output, { input: updateInput });
    });
  });
};
