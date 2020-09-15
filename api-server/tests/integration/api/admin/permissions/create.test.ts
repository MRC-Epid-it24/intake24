import { expect } from 'chai';
import request from 'supertest';
import { setPermission } from '../../mocks/helpers';

export default function (this: Mocha.Suite): void {
  before(async function () {
    this.url = '/admin/permissions/create';
  });

  it('should return 401 when no / invalid token', async function () {
    const res = await request(this.app).get(this.url).set('Accept', 'application/json');

    expect(res.status).to.equal(401);
  });

  it('should return 403 when missing permission', async function () {
    await setPermission('acl');

    const res = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(res.status).to.equal(403);
  });

  it('should return 200 and data/refs', async function () {
    await setPermission(['acl', 'permissions-create']);

    const res = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object').to.have.keys('data', 'refs');
  });
}
