import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import type { StandardUnitCreationAttributes } from '@intake24/db';
import { StandardUnit } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/standard-units';
  const permissions = ['standard-units', 'standard-units:read'];

  let url: string;
  let invalidUrl: string;

  let input: StandardUnitCreationAttributes;
  let standardUnit: StandardUnit;

  beforeAll(async () => {
    input = mocker.foods.standardUnit();
    standardUnit = await StandardUnit.create(input);

    url = `${baseUrl}/${standardUnit.id}`;
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
      await suite.sharedTests.assertRecord('get', url, input);
    });
  });
};
