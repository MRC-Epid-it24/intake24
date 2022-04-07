import fs from 'fs-extra';
import request from 'supertest';
import { suite } from '@intake24/api-tests/integration/helpers';
import { GuideImageEntry } from '@intake24/common/types/http/admin';

export default () => {
  const url = '/api/admin/images/guides';
  const permissions = ['guide-images', 'guide-images|create'];

  const input = {
    id: 'guideImage_001',
    description: 'guideImage_001_description',
    imageMapId: 'imageMapForGuide',
  };

  let output: Omit<GuideImageEntry, 'baseImageUrl'>;

  beforeAll(async () => {
    await request(suite.app)
      .post('/api/admin/images/maps')
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.superuser)
      .field('id', 'imageMapForGuide')
      .field('description', 'imageMapForGuide')
      .attach('baseImage', fs.createReadStream(suite.files.images.jpg), 'imageMapForGuide.jpg');

    output = { ...input, objects: [] };
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertMissingInput('post', url, ['id', 'description', 'imageMapId']);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          id: './guideImage_001',
          imageMapId: 'nonExistingImageMapId',
          description: { key: 'invalidDescription' },
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['id', 'description', 'imageMapId']);
    });

    it('should return 201 and new resource', async () => {
      await suite.sharedTests.assertRecordInserted('post', url, output, { input });
    });

    it('should return 422 for duplicate id', async () => {
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
