import request from 'supertest';
import { suite } from '@intake24/api-tests/integration/helpers';

export default (): void => {
  const baseUrl = '/api/portion-sizes/guide-images';
  const url = `${baseUrl}/SetOne`;
  const invalidUrl = `${baseUrl}/InvalidSet`;

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
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
