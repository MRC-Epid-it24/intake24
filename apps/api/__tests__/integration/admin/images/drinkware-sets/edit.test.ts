import request from 'supertest';

import type { DrinkwareSetResponse } from '@intake24/common/types/http';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const baseUrl = '/api/admin/images/drinkware-sets';
  const permissions = ['drinkware-sets', 'drinkware-sets|edit'];

  const input = {
    id: 'drinkwareSet_003',
    description: 'drinkwareSet_003_description',
    imageMapId: 'imageMapForDrinkwareSet',
  };

  let output: DrinkwareSetResponse;

  const url = `${baseUrl}/${input.id}/edit`;
  const invalidUrl = `${baseUrl}/999999/edit`;

  beforeAll(async () => {
    const { body } = await request(suite.app)
      .post(baseUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.superuser)
      .send(input);

    output = { ...body };
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
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
