import { expect } from 'chai';
import request from 'supertest';

export default function (): void {
  before(async function () {
    const baseUrl = '/api/portion-sizes/as-served-set';
    this.url = `${baseUrl}/SetOne`;
    this.invalidUrl = `${baseUrl}/InvalidSet`;
  });

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).get(this.url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it(`should return 404 when record doesn't exist`, async function () {
    const { status } = await request(this.app)
      .get(this.invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.respondent);

    expect(status).to.equal(404);
  });

  // TODO: tests for dummy data
}
