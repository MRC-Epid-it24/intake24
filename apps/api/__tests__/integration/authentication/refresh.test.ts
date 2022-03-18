import request from 'supertest';
import { suite } from '@intake24/api-tests/integration/helpers';
import securityConfig from '@intake24/api/config/security';

export default () => {
  const url = '/api/auth/refresh';

  it('Missing refresh token cookie should should return 401', async () => {
    const { status } = await request(suite.app).post(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('Invalid refresh token cookie should should return 401', async () => {
    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Cookie', [`${securityConfig.jwt.cookie.name}=invalidToken`]);

    expect(status).toBe(401);
  });

  it('Valid refresh token should return 200, access token & refresh cookie', async () => {
    const loginRes = await request(suite.app)
      .post('/api/auth/login')
      .set('Accept', 'application/json')
      .send({ email: 'testUser@example.com', password: 'testUserPassword' });

    const refreshToken = loginRes
      .get('Set-Cookie')[0]
      .split(';')[0]
      .replace(`${securityConfig.jwt.cookie.name}=`, '');

    const res = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Cookie', [`${securityConfig.jwt.cookie.name}=${refreshToken}`]);

    const newRefreshToken = res
      .get('Set-Cookie')[0]
      .split(';')[0]
      .replace(`${securityConfig.jwt.cookie.name}=`, '');

    expect(refreshToken).not.toBe(newRefreshToken);

    expect(res.status).toBe(200);
    expect(res.body).toContainAllKeys(['accessToken']);

    expect(res.get('Set-Cookie').length).toBeGreaterThanOrEqual(1);
    expect(
      res
        .get('Set-Cookie')
        .some((cookie) => cookie.split('=')[0] === securityConfig.jwt.cookie.name)
    ).toBeTrue();
  });
};
