import request from 'supertest';
import { suite } from '@intake24/api-tests/integration/helpers';
import securityConfig from '@intake24/api/config/security';

export default () => {
  const url = '/api/auth/login/token';

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
      .send({ token: suite.data.system.respondent.urlAuthToken });

    expect(res.status).toBe(200);
    expect(res.body).toContainAllKeys(['accessToken']);

    expect(res.get('Set-Cookie').length).toBeGreaterThanOrEqual(1);
    expect(
      res
        .get('Set-Cookie')
        .some((cookie) => cookie.split('=')[0] === securityConfig.jwt.survey.cookie.name)
    ).toBeTrue();
  });
};
