import { expect } from 'chai';
import { pick, omit } from 'lodash';
import request from 'supertest';
import ioc from '@/ioc';
import { setPermission } from '../../mocks/helpers';
import * as mocker from '../../mocks/mocker';

export default function (): void {
  before(async function () {
    this.input = mocker.user();
    this.user = await ioc.cradle.userService.create(this.input);
    this.output = omit(this.input, ['password', 'passwordConfirm']);

    const baseUrl = '/api/admin/users';
    this.url = `${baseUrl}/${this.user.id}`;
    this.invalidUrl = `${baseUrl}/999999`;
  });

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).get(this.url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it('should return 403 when missing permission', async function () {
    await setPermission('acl');

    const { status } = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.user);

    expect(status).to.equal(403);
  });

  describe('with correct permissions', function () {
    before(async function () {
      await setPermission(['acl', 'users-detail']);
    });

    it(`should return 404 when record doesn't exist`, async function () {
      const { status } = await request(this.app)
        .get(this.invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user);

      expect(status).to.equal(404);
    });

    it('should return 200 and data/refs', async function () {
      const { status, body } = await request(this.app)
        .get(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user);

      expect(status).to.equal(200);
      expect(body).to.be.an('object').to.have.keys('data', 'refs');
      expect(pick(body.data, Object.keys(this.output))).to.deep.equal(this.output);
    });
  });
}
