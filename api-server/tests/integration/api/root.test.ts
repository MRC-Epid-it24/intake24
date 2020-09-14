import { expect } from 'chai';
import request from 'supertest';

export default (): void => {
  it('GET / should return 404', async function () {
    const res = await request(this.app).get('/').set('Accept', 'application/json');

    expect(res.status).to.equal(404);
  });

  it('GET /non-existing-route should return 404', async function () {
    const res = await request(this.app)
      .get('/non-existing-route')
      .set('Accept', 'application/json');

    expect(res.status).to.equal(404);
  });
};
