import { expect } from 'chai';
import request from 'supertest';

export default function (): void {
  before(async function () {
    this.url = '/api/subscriptions/push';
  });

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).get(this.url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it('should return 200 and no content', async function () {
    const { status, body } = await request(this.app)
      .post(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.respondent);

    expect(status).to.equal(200);
    expect(body).to.be.empty;
  });
}
