import fs from 'fs-extra';
import { pick } from 'lodash';
import request from 'supertest';
import { suite, setPermission } from '@tests/integration/helpers';
import { AsServedSetEntry } from '@common/types/http/admin';

export default (): void => {
  const baseUrl = '/api/admin/images/as-served';

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

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).put(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .put(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission('as-served-edit');
    });

    it('should return 422 for missing input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['description', 'images']);
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
      const { status } = await request(suite.app)
        .put(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(404);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(200);
      expect(pick(body, Object.keys(output))).toEqual(output);
    });
  });
};
