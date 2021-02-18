import { expect } from 'chai';
import request from 'supertest';

export default function (): void {
  before(async function () {
    const baseUrl = '/api/portion-sizes/image-maps';
    this.url = `${baseUrl}/?id[]=SetOne&id[]=SetTwo`;
    this.invalidUrl = `${baseUrl}/?id[]=InvalidSet`;
  });

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).get(this.url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it('should return 200 and empty array when no query provided', async function () {
    const { status, body } = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.respondent);

    expect(status).to.equal(200);
    expect(body).to.be.an('array').to.be.empty;
  });

  it(`should return 200 and empty array when record doesn't exist`, async function () {
    const { status, body } = await request(this.app)
      .get(this.invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.respondent);

    expect(status).to.equal(200);
    expect(body).to.be.an('array').to.be.empty;
  });

  // TODO: tests for dummy data
}
