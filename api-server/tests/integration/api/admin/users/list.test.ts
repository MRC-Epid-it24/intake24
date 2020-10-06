import { expect } from 'chai';
import request from 'supertest';
import { setPermission } from '../../mocks/helpers';

export default function (): void {
  before(async function () {
    this.url = '/api/admin/users';
  });

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).get(this.url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it(`should return 403 when user doesn't have 'acl' for resource root'`, async function () {
    await setPermission([]);

    const { status } = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  it(`should return 403 when user doesn't have 'users-list'`, async function () {
    await setPermission('acl');

    const { status } = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  it('should return 200 and data/refs list', async function () {
    await setPermission(['acl', 'users-list']);

    const { status, body } = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(200);
    expect(body).to.be.an('object').to.have.keys('data', 'meta');
  });
}
