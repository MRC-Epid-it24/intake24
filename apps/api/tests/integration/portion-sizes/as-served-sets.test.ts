import request from 'supertest';
import { suite } from '@tests/integration/helpers';

export default (): void => {
  const baseUrl = '/api/portion-sizes/as-served-sets';
  const url = `${baseUrl}/?id[]=SetOne&id[]=SetTwo`;
  const invalidUrl = `${baseUrl}/?id[]=InvalidSet`;

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 200 and empty array when no query provided', async () => {
    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(200);
    expect(body).toBeEmpty();
  });

  it(`should return 200 and empty array when record doesn't exist`, async () => {
    const { status, body } = await request(suite.app)
      .get(invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(200);
    expect(body).toBeEmpty();
  });

  // TODO: tests for dummy data
};
