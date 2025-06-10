import request from 'supertest';

import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/subscriptions';

  it('should return 401 when no / invalid token', async () => {
    await suite.sharedTests.assertMissingAuthentication('post', url);
  });

  it('should return 400 for missing input data', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent)
      .send({});

    expect(status).toBe(400);
    expect(body).toContainAllKeys(['errors', 'message']);
    expect(body.errors).toContainAllKeys(['subscription']);
  });

  it('should return 400 for invalid input data', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent)
      .send({
        subscription: {
          endpoint: 'invalid endpoint',
        },
      });

    expect(status).toBe(400);
    expect(body).toContainAllKeys(['errors', 'message']);
    expect(body.errors).toContainAllKeys(['subscription.expirationTime', 'subscription.keys']);
  });

  it('should return 201 and no content', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent)
      .send({
        subscription: {
          endpoint: 'endpoint',
          expirationTime: null,
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
