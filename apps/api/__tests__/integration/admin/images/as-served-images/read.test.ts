import fs from 'fs-extra';
import { pick } from 'lodash';
import request from 'supertest';
import { suite } from '@intake24/api-tests/integration/helpers';
import { AsServedImageEntry } from '@intake24/common/types/http/admin';

export default () => {
  const baseUrl = '/api/admin/images/as-served/asServedSetForImages/images';
  const invalidBaseUrl = '/api/admin/images/as-served/InvalidAsServedSetForImages/images';
  const permissions = ['as-served', 'as-served|read'];

  const fileName = 'asServedImage_002.jpg';
  const weight = 10;

  let url: string;
  const invalidUrl = `${baseUrl}/999999`;
  let invalidParentUrl: string;

  let output: AsServedImageEntry;

  beforeAll(async () => {
    const { body } = await request(suite.app)
      .post(baseUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.superuser)
      .field('weight', weight)
      .attach('image', fs.createReadStream(suite.files.images.jpg), fileName);

    output = { ...body };

    url = `${baseUrl}/${output.id}`;
    invalidParentUrl = `${invalidBaseUrl}/${output.id}`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when parent record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('get', invalidParentUrl);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('get', invalidUrl);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(200);
      expect(pick(body, Object.keys(output))).toEqual(output);
    });
  });
};
