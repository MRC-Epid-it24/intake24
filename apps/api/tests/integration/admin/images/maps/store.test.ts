import fs from 'fs-extra';
import { pick } from 'lodash';
import request from 'supertest';
import { suite, setPermission } from '@tests/integration/helpers';
import { ImageMapEntry } from '@common/types/http/admin';

export default (): void => {
  const url = '/api/admin/images/maps';

  const fileName = 'imageMap_001.jpg';
  const id = 'imageMap_001';
  const description = 'imageMap_001_description';

  let filePath: string;
  let output: Omit<ImageMapEntry, 'baseImageUrl'>;

  beforeAll(async () => {
    filePath = suite.files.images.jpg;

    output = { id, description, objects: [] };
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).post(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission('image-maps-create');
    });

    it('should return 422 when missing input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['id', 'description', 'baseImage']);
    });

    it('should return 422 when invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .field('id', '/etc/imageMap_001')
        .field('description', [])
        .field('baseImage', 'notAFile');

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['id', 'description', 'baseImage']);
    });

    it('should return 201 and new resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .field('id', id)
        .field('description', description)
        .attach('baseImage', fs.createReadStream(filePath), fileName);

      expect(status).toBe(201);
      expect(body).toContainAllKeys(['data']);
      expect(pick(body.data, Object.keys(output))).toEqual(output);
    });

    it('should return 422 when duplicate id', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .field('id', id)
        .field('description', description)
        .attach('baseImage', fs.createReadStream(filePath), fileName);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['id']);
    });
  });
};
