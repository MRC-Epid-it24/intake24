import fs from 'fs-extra';
import { pick } from 'lodash';
import request from 'supertest';
import { suite, setPermission } from '@intake24/api-tests/integration/helpers';
import { ImageMapEntry } from '@intake24/common/types/http/admin';

export default () => {
  const baseUrl = '/api/admin/images/maps';

  const fileName = 'imageMap_003.jpg';
  const id = 'imageMap_003';
  const description = 'imageMap_003_description';

  const url = `${baseUrl}/${id}/edit`;
  const invalidUrl = `${baseUrl}/999999/edit`;

  let output: ImageMapEntry;

  beforeAll(async () => {
    const { body } = await request(suite.app)
      .post(baseUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.superuser)
      .field('id', id)
      .field('description', description)
      .attach('baseImage', fs.createReadStream(suite.files.images.jpg), fileName);

    output = { ...body };
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
  });

  describe('authenticated / authorized', () => {
    beforeAll(async () => {
      await setPermission('image-maps|edit');
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
