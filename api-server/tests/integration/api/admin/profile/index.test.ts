import { expect } from 'chai';
import request from 'supertest';

export default (): void => {
  const url = '/admin/profile';

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).get(url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it('should return 200 and profile data', async function () {
    const { status, body } = await request(this.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(200);
    expect(body).to.be.an('object').to.have.keys('profile', 'permissions', 'roles');
  });
};
