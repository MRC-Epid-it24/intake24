import { expect } from 'chai';
import request from 'supertest';
import { Permission } from '@/db/models/system';
import { setPermission } from '../../mocks/helpers';
import * as mocker from '../../mocks/mocker';

export default function (this: Mocha.Suite): void {
  before(async function () {
    this.input = mocker.permission();
    this.permission = await Permission.create(this.input);

    const baseUrl = '/admin/permissions';
    this.url = `${baseUrl}/${this.permission.id}`;
    this.invalidUrl = `${baseUrl}/999999`;
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

  describe('resource input/data tests', function () {
    before(async function () {
      await setPermission(['acl', 'permissions-detail']);
    });

    it(`should return 404 when record doesn't exist`, async function () {
      const res = await request(this.app)
        .get(this.invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer);

      expect(res.status).to.equal(404);
    });

    it('should return 200 and data/refs', async function () {
      const res = await request(this.app)
        .get(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object').to.have.keys('data', 'refs');
    });
  });
}
