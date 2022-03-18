import fs from 'fs-extra';
import request from 'supertest';
import { suite, setPermission } from '@intake24/api-tests/integration/helpers';

export default () => {
  const baseUrl = '/api/admin/images/maps';

  const fileName = 'imageMap_005.jpg';
  const id = 'imageMap_005';
  const description = 'imageMap_005_description';

  const url = `${baseUrl}/${id}`;
  const invalidUrl = `${baseUrl}/999999`;

  beforeAll(async () => {
    await request(suite.app)
      .post(baseUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.superuser)
      .field('id', id)
      .field('description', description)
      .attach('baseImage', fs.createReadStream(suite.files.images.jpg), fileName);
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('delete', url);
  });

  describe('authenticated / authorized', () => {
    beforeAll(async () => {
      await setPermission('image-maps|delete');
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('delete', invalidUrl);
    });

    it('should return 204 and no content', async () => {
      await suite.sharedTests.assertRecordDeleted('delete', url);
    });
  });
};
