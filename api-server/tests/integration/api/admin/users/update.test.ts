import { expect } from 'chai';
import { omit, pick, times } from 'lodash';
import request from 'supertest';
import { Role, Permission } from '@/db/models/system';
import userSvc from '@/services/user.service';
import { setPermission } from '../../mocks/helpers';
import * as mocker from '../../mocks/mocker';

export default function (): void {
  before(async function () {
    this.input = mocker.user();
    this.updateInput = omit(mocker.user(), ['password', 'passwordConfirm']);

    const permissionInput = times(3, () => mocker.permission());
    this.permissions = await Permission.bulkCreate(permissionInput);
    this.updateInput.permissions = this.permissions.map((item: Permission) => item.id);

    const roleInput = times(2, () => mocker.role());
    this.roles = await Role.bulkCreate(roleInput);
    this.updateInput.roles = this.roles.map((item: Role) => item.id);

    this.output = { ...this.input };

    this.user = await userSvc.create(this.input);

    const baseUrl = '/admin/users';
    this.url = `${baseUrl}/${this.user.id}`;
    this.invalidUrl = `${baseUrl}/999999`;
  });

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).put(this.url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it('should return 403 when missing permission', async function () {
    await setPermission('acl');

    const { status } = await request(this.app)
      .put(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  describe('with correct permissions', function () {
    before(async function () {
      await setPermission(['acl', 'users-edit']);
    });

    it('should return 422 when missing input data', async function () {
      const { status, body } = await request(this.app)
        .put(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer);

      expect(status).to.equal(422);
      expect(body).to.be.an('object').to.have.keys('errors', 'success');
      expect(body.errors).to.have.keys('permissions', 'roles');
    });

    it('should return 422 when invalid input data', async function () {
      const { status, body } = await request(this.app)
        .put(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer)
        .send({
          email: 'invalidEmailFormat',
          multiFactorAuthentication: 10,
          emailNotifications: 'string',
          smsNotifications: [100],
          permissions: [1, 'invalidId', 2],
          roles: [1, 'invalidId', 2],
        });

      expect(status).to.equal(422);
      expect(body).to.be.an('object').to.have.keys('errors', 'success');
      expect(body.errors).to.have.keys(
        'email',
        'multiFactorAuthentication',
        'emailNotifications',
        'smsNotifications',
        'permissions',
        'roles'
      );
    });

    it(`should return 404 when record doesn't exist`, async function () {
      const { status } = await request(this.app)
        .put(this.invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer)
        .send(this.updateInput);

      expect(status).to.equal(404);
    });

    it('should return 200 and accept same email', async function () {
      const { email } = this.input;

      const { status, body } = await request(this.app)
        .put(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer)
        .send({ email, permissions: [], roles: [] });

      expect(status).to.equal(200);
      expect(body).to.be.an('object').to.have.keys('data', 'refs');
      expect(body.data.email).to.equal(email);
    });

    it('should return 200 and data/refs', async function () {
      const { status, body } = await request(this.app)
        .put(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer)
        .send(this.updateInput);

      expect(status).to.equal(200);
      expect(body).to.be.an('object').to.have.keys('data', 'refs');

      const data = {
        ...body.data,
        permissions: body.data.permissions.map((item: Permission) => item.id),
        roles: body.data.roles.map((item: Role) => item.id),
      };

      expect(pick(data, Object.keys(this.updateInput))).to.deep.equal(this.updateInput);
    });
  });
}
