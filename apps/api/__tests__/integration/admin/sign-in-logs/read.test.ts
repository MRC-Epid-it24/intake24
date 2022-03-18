import request from 'supertest';
import { suite, setPermission } from '@intake24/api-tests/integration/helpers';

export default () => {
  const baseUrl = '/api/admin/sign-in-logs';

  let url: string;
  let invalidUrl: string;

  beforeAll(async () => {
    url = `${baseUrl}/1`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
  });

  describe('authenticated / authorized', () => {
    beforeAll(async () => {
      await setPermission('sign-in-logs|read');
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
      expect(body).not.toBeEmpty();
    });
  });
};
