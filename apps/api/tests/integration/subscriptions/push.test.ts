import request from 'supertest';
import { suite } from '@tests/integration/helpers';

export default (): void => {
  const url = '/api/subscriptions/push';

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 200 and no content', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(200);
    expect(body).toBeEmpty();
  });
};
