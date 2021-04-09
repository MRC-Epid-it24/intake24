import fs from 'fs-extra';
import { pick } from 'lodash';
import request from 'supertest';
import { downloadImage, suite, setPermission } from '@tests/integration/helpers';
import { ImageMapEntry } from '@common/types/http/admin';

export default (): void => {
  const baseUrl = '/api/admin/images/maps';

  const fileName = 'imageMap_004.jpg';
  const id = 'imageMap_004';
  const description = 'imageMap_004_description';

  const updateInput = {
    description: 'updated_imageMap_004_description',
    objects: [
      {
        id: 0,
        description: 'obj_description_0',
        outlineCoordinates: [1, 2, 3, 4, 5, 6],
      },
      {
        id: 1,
        description: 'obj_description_1',
        outlineCoordinates: [7, 8, 9, 10, 11, 12],
      },
    ],
  };

  const url = `${baseUrl}/${id}`;
  const invalidUrl = `${baseUrl}/999999`;

  let filePath: string;
  let output: ImageMapEntry;

  beforeAll(async () => {
    filePath = await downloadImage('https://picsum.photos/1200/800.jpg', fileName);
    const { body } = await request(suite.app)
      .post(baseUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.admin)
      .field('id', id)
      .field('description', description)
      .attach('baseImage', fs.createReadStream(filePath), fileName);

    output = { ...body.data, ...updateInput };
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
      await setPermission('image-maps-edit');
    });

    it('should return 422 when missing input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['description', 'objects']);
    });

    it('should return 422 when invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          description: ['invalid description'],
          objects: 'notValidObjects',
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['description', 'objects']);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .put(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(404);
    });

    it('should return 200 and data/refs', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['data', 'refs']);
      expect(pick(body.data, Object.keys(output))).toEqual(output);
    });
  });
};
