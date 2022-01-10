import request from 'supertest';
import { suite, setPermission } from '@intake24/api-tests/integration/helpers';

export default (): void => {
  const url = '/api/admin/users';

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it(`should return 403 when user doesn't have 'acl' for resource root'`, async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when user doesn't have 'users-browse'`, async () => {
    await setPermission('acl');

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it('should return 200 and data/refs list', async () => {
    await setPermission(['acl', 'users-browse']);

    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(200);
    expect(body).toContainAllKeys(['data', 'meta']);
    expect(body.data).toBeArray();
    expect(body.data).not.toBeEmpty();
  });
};
