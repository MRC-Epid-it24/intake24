import { expect } from 'chai';
import request from 'supertest';
import ioc from '@/ioc';

export default function (): void {
  before(async function () {
    this.url = '/api/portion-sizes/weight';
  });

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).get(this.url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it(`should return 200 and record`, async function () {
    const { config } = ioc.cradle;

    const { status, body } = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.respondent);

    expect(status).to.equal(200);
    expect(body)
      .to.be.a('object')
      .deep.equal({
        method: 'weight',
        description: 'weight',
        parameters: {},
        imageUrl: `${config.app.urls.images}/portion/weight.png`,
        useForRecipes: true,
        conversionFactor: 1.0,
      });
  });
}
