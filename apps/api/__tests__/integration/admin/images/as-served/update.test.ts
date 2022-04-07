import fs from 'fs-extra';
import request from 'supertest';
import { suite } from '@intake24/api-tests/integration/helpers';
import { AsServedSetEntry } from '@intake24/common/types/http/admin';

export default () => {
  const baseUrl = '/api/admin/images/as-served';
  const permissions = ['as-served', 'as-served|edit'];

  const fileName = 'asServedSet_004.jpg';
  const id = 'asServedSet_004';
  const description = 'asServedSet_004_description';

  let updateInput: Omit<AsServedSetEntry, 'id' | 'selectionImageUrl'> = {
    description: 'updated_asServedSet_004_description',
    images: [],
  };

  const url = `${baseUrl}/${id}`;
  const invalidUrl = `${baseUrl}/999999`;

  let output: AsServedSetEntry;

  beforeAll(async () => {
    const { body } = await request(suite.app)
      .post(baseUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.superuser)
      .field('id', id)
      .field('description', description)
      .attach('selectionImage', fs.createReadStream(suite.files.images.jpg), fileName);

    const images = [];
    for (const weight of [50, 100, 150]) {
      const { body: image } = await request(suite.app)
        .post(`${url}/images`)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.superuser)
        .field('weight', 10)
        .attach('image', fs.createReadStream(suite.files.images.jpg), fileName);

      images.push({ ...image, weight });
    }

    updateInput = { ...updateInput, images };
    output = { ...body, ...updateInput };
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('put', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertMissingInput('put', url, ['description', 'images']);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          description: ['invalid description'],
          images: 'notValidObjects',
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['description', 'images']);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('put', invalidUrl, { input: updateInput });
    });

    it('should return 200 and data', async () => {
      await suite.sharedTests.assertRecordUpdated('put', url, output, { input: updateInput });
    });
  });
};
