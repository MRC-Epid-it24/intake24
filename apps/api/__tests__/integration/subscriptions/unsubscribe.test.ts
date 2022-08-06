import request from 'supertest';

import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/subscriptions';

  it('should return 401 when no / invalid token', async () => {
    await suite.sharedTests.assertMissingAuthentication('get', url);
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
