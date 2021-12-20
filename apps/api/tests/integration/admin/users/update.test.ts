import { omit, pick, times } from 'lodash';
import request from 'supertest';
import { CustomField } from '@common/types';
import { CreateUserRequest, UpdateUserRequest } from '@common/types/http/admin';
import { mocker, suite, setPermission } from '@tests/integration/helpers';
import ioc from '@api/ioc';
import { Permission, Role, User } from '@api/db/models/system';

export default (): void => {
  const baseUrl = '/api/admin/users';

  let url: string;
  let invalidUrl: string;

  let input: CreateUserRequest;
  let updateInput: UpdateUserRequest;
  let user: User;

  beforeAll(async () => {
    input = mocker.system.user();
    const updateUser = omit(mocker.system.user(), ['password', 'passwordConfirm']);
    updateInput = {
      ...updateUser,
      email: updateUser.email?.toLocaleLowerCase(),
    };

    const permissionInput = times(3, () => mocker.system.permission());
    const permissions = await Permission.bulkCreate(permissionInput);
    updateInput.permissions = permissions.map((item) => item.id);

    const roleInput = times(2, () => mocker.system.role());
    const roles = await Role.bulkCreate(roleInput);
    updateInput.roles = roles.map((item) => item.id);

    user = await ioc.cradle.adminUserService.create(input);

    url = `${baseUrl}/${user.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).put(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission('acl');

    const { status } = await request(suite.app)
      .put(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission(['acl', 'users-edit']);
    });

    it('should return 422 for missing input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['permissions', 'roles']);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          email: 'invalidEmailFormat',
          multiFactorAuthentication: 10,
          emailNotifications: 'string',
          smsNotifications: [100],
          customFields: [{ name: 'fieldName', missingValueKey: false }],
          permissions: [1, 'invalidId', 2],
          roles: [1, 'invalidId', 2],
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys([
        'email',
        'multiFactorAuthentication',
        'emailNotifications',
        'smsNotifications',
        'customFields',
        'permissions',
        'roles',
      ]);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .put(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(404);
    });

    it('should return 200 and accept same email', async () => {
      const { email } = input;

      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ email, permissions: [], roles: [] });

      expect(status).toBe(200);
      expect(body.email).toBe(email?.toLocaleLowerCase());
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(200);

      // Extract custom fields, permissions, roles for non-order specific comparison
      const {
        customFields: resCustomFields,
        permissions: resPermissions,
        roles: resRoles,
        ...data
      } = body;

      const {
        customFields: outputCustomFields,
        permissions: outputPermissions,
        roles: outputRoles,
        ...restUpdateInput
      } = updateInput;

      // 1) match the output
      expect(pick(data, Object.keys(restUpdateInput))).toEqual(restUpdateInput);

      // 2) non-order specific comparison
      if (outputCustomFields) {
        const fields = resCustomFields.map(({ name, value }: CustomField) => ({
          name,
          value,
        }));
        expect(fields).toIncludeSameMembers(outputCustomFields);
      }

      expect(resPermissions.map((item: Permission) => item.id)).toEqual(outputPermissions);
      expect(resRoles.map((item: Role) => item.id)).toEqual(outputRoles);
    });
  });
};
