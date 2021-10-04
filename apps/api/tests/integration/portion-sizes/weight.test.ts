import request from 'supertest';
import { suite } from '@tests/integration/helpers';
import ioc from '@api/ioc';

export default (): void => {
  const url = '/api/portion-sizes/weight';

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it(`should return 200 and record`, async () => {
    const { imagesBaseUrl } = ioc.cradle;

    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(200);
    expect(body).toEqual({
      method: 'weight',
      description: 'weight',
      parameters: {},
      imageUrl: `${imagesBaseUrl}/portion/weight.png`,
      useForRecipes: true,
      conversionFactor: 1.0,
    });
  });
};
