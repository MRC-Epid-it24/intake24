import request from 'supertest';

import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const baseUrl = '/api/portion-sizes/drinkware-sets';
  const url = `${baseUrl}/SetOne`;
  const invalidUrl = `${baseUrl}/InvalidSet`;

  it('should return 401 when no / invalid token', async () => {
    await suite.sharedTests.assertMissingAuthentication('get', url);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    const { status } = await request(suite.app)
      .get(invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(404);
  });

  // TODO: tests for dummy data
};
