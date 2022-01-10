import request from 'supertest';
import { suite } from '@intake24/api-tests/integration/helpers';

export default (): void => {
  const url = '/api/subscriptions';

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 204 and no content', async () => {
    const { status, body } = await request(suite.app)
      .delete(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(204);
    expect(body).toBeEmpty();
  });
};
