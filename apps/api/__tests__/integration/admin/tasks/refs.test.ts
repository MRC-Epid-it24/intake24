import request from 'supertest';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/tasks/refs';
  const permissions = ['tasks'];

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
  });

  it('should return 200 and data', async () => {
    await suite.util.setPermission(permissions);

    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(200);
    expect(body).toContainAllKeys(['jobs']);
  });
};
