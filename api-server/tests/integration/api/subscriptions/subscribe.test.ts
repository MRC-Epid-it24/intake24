import { expect } from 'chai';
import request from 'supertest';

export default function (): void {
  before(async function () {
    this.url = '/api/subscriptions';
  });

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).get(this.url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it('should return 422 when missing input data', async function () {
    const { status, body } = await request(this.app)
      .post(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.respondent);

    expect(status).to.equal(422);
    expect(body).to.be.an('object').to.have.keys('errors', 'success');
    expect(body.errors).to.have.keys('subscription');
  });

  it('should return 422 when invalid input data', async function () {
    const { status, body } = await request(this.app)
      .post(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.respondent)
      .send({
        subscription: {
          endpoint: 'invalid endpoint',
        },
      });

    expect(status).to.equal(422);
    expect(body).to.be.an('object').to.have.keys('errors', 'success');
    expect(body.errors).to.have.keys('subscription');
  });

  it('should return 201 and no content', async function () {
    const { status, body } = await request(this.app)
      .post(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.respondent)
      .send({
        subscription: {
          endpoint: 'endpoint',
          keys: {
            p256dh: 'p256dh',
            auth: 'auth',
          },
        },
      });

    expect(status).to.equal(201);
    expect(body).to.be.empty;
  });
}
