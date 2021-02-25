import { expect } from 'chai';
import { omit, pick, times } from 'lodash';
import request from 'supertest';
import { Role, Permission } from '@/db/models/system';
import ioc from '@/ioc';
import { CustomField } from '@common/types';
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

    this.user = await ioc.cradle.userService.create(this.input);

    const baseUrl = '/api/admin/users';
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
      .set('Authorization', this.bearer.user);

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
        .set('Authorization', this.bearer.user);

      expect(status).to.equal(422);
      expect(body).to.be.an('object').to.have.keys('errors', 'success');
      expect(body.errors).to.have.keys('permissions', 'roles');
    });

    it('should return 422 when invalid input data', async function () {
      const { status, body } = await request(this.app)
        .put(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user)
        .send({
          email: 'invalidEmailFormat',
          multiFactorAuthentication: 10,
          emailNotifications: 'string',
          smsNotifications: [100],
          customFields: [{ name: 'fieldName', missingValueKey: false }],
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
        'customFields',
        'permissions',
        'roles'
      );
    });

    it(`should return 404 when record doesn't exist`, async function () {
      const { status } = await request(this.app)
        .put(this.invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user)
        .send(this.updateInput);

      expect(status).to.equal(404);
    });

    it('should return 200 and accept same email', async function () {
      const { email } = this.input;

      const { status, body } = await request(this.app)
        .put(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user)
        .send({ email, permissions: [], roles: [] });

      expect(status).to.equal(200);
      expect(body).to.be.an('object').to.have.keys('data', 'refs');
      expect(body.data.email).to.equal(email);
    });

    it('should return 200 and data/refs', async function () {
      const { status, body } = await request(this.app)
        .put(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user)
        .send(this.updateInput);

      expect(status).to.equal(200);
      expect(body).to.be.an('object').to.have.keys('data', 'refs');

      // Extract custom fields, permissions, roles for non-order specific comparison
      const {
        customFields: resCustomFields,
        permissions: resPermissions,
        roles: resRoles,
        ...data
      } = body.data;

      const {
        customFields: outputCustomFields,
        permissions: outputPermissions,
        roles: outputRoles,
        ...updateInput
      } = this.updateInput;

      // 1) match the output
      expect(pick(data, Object.keys(updateInput))).to.deep.equal(updateInput);

      // 2) non-order specific comparison
      const fields = resCustomFields.map(({ name, value }: CustomField) => ({
        name,
        value,
      }));
      expect(fields).to.have.deep.members(outputCustomFields);

      expect(resPermissions.map((item: Permission) => item.id)).to.have.deep.members(
        outputPermissions
      );
      expect(resRoles.map((item: Role) => item.id)).to.have.deep.members(outputRoles);
    });
  });
}
