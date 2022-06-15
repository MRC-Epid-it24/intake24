import { omit, pick, times } from 'lodash';
import request from 'supertest';
import type { CustomField } from '@intake24/common/types';
import type { CreateUserRequest, UpdateUserRequest } from '@intake24/common/types/http/admin';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import ioc from '@intake24/api/ioc';
import type { User } from '@intake24/db';
import { Permission, Role } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/users';
  const permissions = ['acl', 'users', 'users|edit'];

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
    const permissionsRecords = await Permission.bulkCreate(permissionInput);
    updateInput.permissions = permissionsRecords.map((item) => item.id);

    const roleInput = times(2, () => mocker.system.role());
    const roles = await Role.bulkCreate(roleInput);
    updateInput.roles = roles.map((item) => item.id);

    user = await ioc.cradle.adminUserService.create(input);

    url = `${baseUrl}/${user.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('put', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('put', url, ['permissions', 'roles']);
    });

    it('should return 422 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput(
        'put',
        url,
        [
          'email',
          'multiFactorAuthentication',
          'emailNotifications',
          'smsNotifications',
          'customFields',
          'permissions',
          'roles',
        ],
        {
          input: {
            email: 'invalidEmailFormat',
            multiFactorAuthentication: 10,
            emailNotifications: 'string',
            smsNotifications: [100],
            customFields: [{ name: 'fieldName', missingValueKey: false }],
            permissions: [1, 'invalidId', 2],
            roles: [1, 'invalidId', 2],
          },
        }
      );
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('put', invalidUrl, { input: updateInput });
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
