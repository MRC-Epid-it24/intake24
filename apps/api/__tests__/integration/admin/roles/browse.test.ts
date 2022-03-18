import request from 'supertest';
import { suite, setPermission } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/roles';

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
  });

  it(`should return 403 when user doesn't have 'roles-browse'`, async () => {
    await setPermission('acl');

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it('should return 200 and paginated results', async () => {
    await setPermission(['acl', 'roles|browse']);

    await suite.sharedTests.assertPaginatedResult('get', url);
  });
};
