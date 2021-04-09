import fs from 'fs-extra';
import { pick } from 'lodash';
import request from 'supertest';
import { downloadImage, suite, setPermission } from '@tests/integration/helpers';
import { GuideImageEntry } from '@common/types/http/admin';

export default (): void => {
  const url = '/api/admin/images/guides';

  const input = {
    id: 'guideImage_001',
    description: 'guideImage_001_description',
    imageMapId: 'imageMapForGuide',
  };

  let output: Omit<GuideImageEntry, 'baseImageUrl'>;

  beforeAll(async () => {
    const filePath = await downloadImage(
      'https://picsum.photos/1200/800.jpg',
      'imageMapForGuide.jpg'
    );
    await request(suite.app)
      .post('/api/admin/images/maps')
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.admin)
      .field('id', 'imageMapForGuide')
      .field('description', 'imageMapForGuide')
      .attach('baseImage', fs.createReadStream(filePath), 'imageMapForGuide.jpg');

    output = { ...input, objects: [] };
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
      await setPermission('guide-images-create');
    });

    it('should return 422 when missing input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['id', 'description', 'imageMapId']);
    });

    it('should return 422 when invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          id: null,
          imageMapId: 'nonExistingImageMapId',
          description: { key: 'invalidDescription' },
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['id', 'description', 'imageMapId']);
    });

    it('should return 201 and new resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(status).toBe(201);
      expect(body).toContainAllKeys(['data']);
      expect(pick(body.data, Object.keys(output))).toEqual(output);
    });

    it('should return 422 when duplicate id', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['id']);
    });
  });
};
