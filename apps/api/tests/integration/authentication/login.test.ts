import request from 'supertest';
import { suite } from '@tests/integration/helpers';
import securityConfig from '@api/config/security';

export default (): void => {
  const url = '/api/auth/login';

  it('Missing credentials should return 422 with errors', async () => {
    const { status, body } = await request(suite.app).post(url).set('Accept', 'application/json');

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys(['email', 'password']);
  });

  it('Invalid credentials should return 401', async () => {
    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .send({ email: 'testUser@example.com', password: 'invalidPassword' });

    expect(status).toBe(401);
  });

  it('Valid credentials should return 200, access token & refresh cookie', async () => {
    const res = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .send({ email: 'testUser@example.com', password: 'testUserPassword' });

    expect(res.status).toBe(200);
    expect(res.body).toContainAllKeys(['accessToken']);

    expect(res.get('Set-Cookie')).toHaveLength(1);
    expect(res.get('Set-Cookie')[0].split('=')[0]).toEqual(securityConfig.jwt.cookie.name);
  });
};
