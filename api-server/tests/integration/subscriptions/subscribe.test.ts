import request from 'supertest';
import { suite } from '../helpers';

export default (): void => {
  const url = '/api/subscriptions';

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 422 when missing input data', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys(['subscription']);
  });

  it('should return 422 when invalid input data', async () => {
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
