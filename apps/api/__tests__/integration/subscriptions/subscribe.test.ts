import request from 'supertest';

import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/subscriptions';

  it('should return 401 when no / invalid token', async () => {
    await suite.sharedTests.assertMissingAuthentication('get', url);
  });

  it('should return 422 for missing input data', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys(['subscription']);
  });

  it('should return 422 for invalid input data', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent)
      .send({
        subscription: {
          endpoint: 'invalid endpoint',
        },
      });

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys(['subscription']);
  });

  it('should return 201 and no content', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent)
      .send({
        subscription: {
          endpoint: 'endpoint',
          keys: {
            p256dh: 'p256dh',
            auth: 'auth',
          },
        },
      });

    expect(status).toBe(200);
    expect(body).toBeEmpty();
  });
};
