import { pick } from 'lodash';
import request from 'supertest';
import { suite } from '@intake24/api-tests/integration/helpers';
import { GuideImageEntry } from '@intake24/common/types/http/admin';

export default () => {
  const baseUrl = '/api/admin/images/guides';
  const permissions = ['guide-images', 'guide-images|edit'];

  const input = {
    id: 'guideImage_003',
    description: 'guideImage_003_description',
    imageMapId: 'imageMapForGuide',
  };

  let output: GuideImageEntry;

  const url = `${baseUrl}/${input.id}/edit`;
  const invalidUrl = `${baseUrl}/999999/edit`;

  beforeAll(async () => {
    const { body } = await request(suite.app)
      .post(baseUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.superuser)
      .send(input);

    output = { ...body };
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('get', invalidUrl);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(200);
      expect(pick(body, Object.keys(output))).toEqual(output);
    });
  });
};
