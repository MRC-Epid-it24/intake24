import request from 'supertest';
import { suite, setPermission } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/surveys';

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
  });

  it('should return 200 and empty list when no survey-permissions', async () => {
    await setPermission('surveys|browse');

    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(200);
    expect(body).toContainAllKeys(['data', 'meta']);
    expect(body.data).toBeArrayOfSize(0);
  });

  it('should return 200 and paginated results', async () => {
    await setPermission(['surveys|browse', 'surveyadmin']);

    await suite.sharedTests.assertPaginatedResult('get', url, false);
  });
};
