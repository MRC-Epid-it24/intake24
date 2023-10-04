import fs from 'fs-extra';
import request from 'supertest';

import type { DrinkwareSetEntry } from '@intake24/common/types/http/admin';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/images/drinkware-sets';
  const permissions = ['drinkware-sets', 'drinkware-sets|create'];

  const input = {
    id: 'drinkwareSet_001',
    description: 'drinkwareSet_001_description',
    imageMapId: 'imageMapForDrinkwareSet',
  };

  let output: Omit<DrinkwareSetEntry, 'imageUrl'>;

  beforeAll(async () => {
    await request(suite.app)
      .post('/api/admin/images/image-maps')
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.superuser)
      .field('id', 'imageMapForDrinkwareSet')
      .field('description', 'imageMapForDrinkwareSet')
      .attach(
        'baseImage',
        fs.createReadStream(suite.files.images.jpg),
        'imageMapForDrinkwareSet.jpg'
      );

    output = { ...input, scales: [] };
  });

  test('missing authentication / authorization', async () => {
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
          id: './drinkwareSet_001',
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
