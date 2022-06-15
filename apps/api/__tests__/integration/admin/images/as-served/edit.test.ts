import fs from 'fs-extra';
import request from 'supertest';
import { suite } from '@intake24/api-tests/integration/helpers';
import type { AsServedSetEntry } from '@intake24/common/types/http/admin';

export default () => {
  const baseUrl = '/api/admin/images/as-served';
  const permissions = ['as-served', 'as-served|edit'];

  const fileName = 'asServedSet_003.jpg';
  const id = 'asServedSet_003';
  const description = 'asServedSet_003_description';

  const url = `${baseUrl}/${id}/edit`;
  const invalidUrl = `${baseUrl}/999999/edit`;

  let output: AsServedSetEntry;

  beforeAll(async () => {
    const { body } = await request(suite.app)
      .post(baseUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.superuser)
      .field('id', id)
      .field('description', description)
      .attach('selectionImage', fs.createReadStream(suite.files.images.jpg), fileName);

    output = { ...body };
  });

  test('missing authentication / authorization', async () => {
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
