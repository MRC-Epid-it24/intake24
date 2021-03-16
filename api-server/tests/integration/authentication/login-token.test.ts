import request from 'supertest';
import securityConfig from '@/config/security';
import { suite } from '@tests/integration/helpers';

export default (): void => {
  const url = '/api/login/token';

  it('Missing token should return 401 with errors', async () => {
    const { status } = await request(suite.app).post(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('Invalid token should return 401', async () => {
    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .send({ token: 'invalidToken' });

    expect(status).toBe(401);
  });

  it('Valid token should return 200, access token & refresh cookie', async () => {
    const res = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .send({ token: suite.data.respondent.urlAuthToken });

    expect(res.status).toBe(200);
    expect(res.body).toContainAllKeys(['accessToken']);

    expect(res.get('Set-Cookie')).toHaveLength(1);
    expect(res.get('Set-Cookie')[0].split('=')[0]).toEqual(securityConfig.jwt.cookie.name);
  });
};
