import fs from 'fs-extra';
import { pick } from 'lodash';
import request from 'supertest';

import type { AsServedSetEntry } from '@intake24/common/types/http/admin';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/images/as-served';
  const permissions = ['as-served', 'as-served|create'];

  const fileName = 'asServedSet_001.jpg';
  const id = 'asServedSet_001';
  const description = 'asServedSet_001_description';

  let filePath: string;
  let output: Omit<AsServedSetEntry, 'selectionImageUrl'>;

  beforeAll(async () => {
    filePath = suite.files.images.jpg;

    output = { id, description, images: [] };
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, [
        'id',
        'description',
        'selectionImage',
      ]);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .field('id', '../../asServedSet_001')
        .field('description', [])
        .field('selectionImage', 'notAFile');

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['id', 'description', 'selectionImage']);
    });

    it('should return 201 and new resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .field('id', id)
        .field('description', description)
        .attach('selectionImage', fs.createReadStream(filePath), fileName);

      expect(status).toBe(201);
      expect(pick(body, Object.keys(output))).toEqual(output);
    });

    it('should return 422 for duplicate id', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .field('id', id)
        .field('description', description)
        .attach('selectionImage', fs.createReadStream(filePath), fileName);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['id']);
    });
  });
};
