import fs from 'fs-extra';
import request from 'supertest';

import type { GuideImageEntry } from '@intake24/common/types/http/admin';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/images/guide-images';
  const permissions = ['guide-images', 'guide-images|create'];

  const input = {
    id: 'guideImage_001',
    description: 'guideImage_001_description',
    imageMapId: 'imageMapForGuide',
  };

  let output: Omit<GuideImageEntry, 'baseImageUrl'>;

  beforeAll(async () => {
    await request(suite.app)
      .post('/api/admin/images/image-maps')
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.superuser)
      .field('id', 'imageMapForGuide')
      .field('description', 'imageMapForGuide')
      .attach('baseImage', fs.createReadStream(suite.files.images.jpg), 'imageMapForGuide.jpg');

    output = { ...input, objects: [] };
  });

  it('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 400 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['id', 'description', 'imageMapId']);
    });

    it('should return 400 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['id', 'description', 'imageMapId'], {
        input: {
          id: './guideImage_001',
          imageMapId: 'nonExistingImageMapId',
          description: { key: 'invalidDescription' },
        },
      });
    });

    it('should return 201 and new resource', async () => {
      await suite.sharedTests.assertRecordInserted('post', url, output, { input });
    });

    it('should return 400 for duplicate id', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['id'], { input });
    });
  });
};
