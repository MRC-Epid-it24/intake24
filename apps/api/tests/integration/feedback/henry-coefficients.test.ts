import request from 'supertest';
import { suite } from '@tests/integration/helpers';
import { henryCoefficientsData } from '@common/feedback';

export default (): void => {
  const url = '/api/feedback/henry-coefficients';

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 200 and henry coefficients data', async () => {
    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(200);
    expect(body).toStrictEqual(henryCoefficientsData);
  });
};
