import request from 'supertest';
import { suite } from '@intake24/api-tests/integration/helpers';

export default (): void => {
  const url = '/api/admin/user';

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 200 and profile data', async () => {
    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(200);
    expect(body).toContainAllKeys(['profile', 'permissions', 'roles']);
  });
};
