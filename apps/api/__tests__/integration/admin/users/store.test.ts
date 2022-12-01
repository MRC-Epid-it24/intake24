import { omit, pick } from 'lodash';
import request from 'supertest';

import type { CustomField } from '@intake24/common/types';
import type { CreateUserRequest, UpdateUserRequest } from '@intake24/common/types/http/admin';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/users';
  const permissions = ['acl', 'users', 'users|create'];

  let input: CreateUserRequest;
  let output: Omit<UpdateUserRequest, 'permissions' | 'roles'>;

  beforeAll(async () => {
    input = mocker.system.user();
    output = {
      ...omit(input, ['password', 'passwordConfirm', 'permissions', 'roles']),
      email: input.email?.toLocaleLowerCase(),
    };
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, [
        'password',
        'passwordConfirm',
        'permissions',
        'roles',
      ]);
    });

    it('should return 422 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput(
        'post',
        url,
        [
          'email',
          'password',
          'passwordConfirm',
          'multiFactorAuthentication',
          'emailNotifications',
          'smsNotifications',
          'customFields',
          'permissions',
          'roles',
          'disabledAt',
          'verifiedAt',
        ],
        {
          input: {
            email: 'invalidEmailFormat',
            multiFactorAuthentication: 10,
            emailNotifications: 'string',
            smsNotifications: [100],
            customFields: 'invalidCustomFields',
            permissions: [1, 'invalidId', 2],
            roles: [1, 'invalidId', 2],
            disabledAt: { invalid: new Date() },
            verifiedAt: 'invalidDate',
          },
        }
      );
    });

    it('should return 201 and new resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(status).toBe(201);

      // Extract custom fields for non-order specific comparison
      const { customFields: resCustomFields, ...data } = body;
      const { customFields: outputCustomFields, ...restOutput } = output;

      // 1) match the output
      expect(pick(data, Object.keys(restOutput))).toEqual(restOutput);

      // 2) non-order specific custom field comparison
      if (outputCustomFields) {
        const fields: CustomField[] = resCustomFields.map(({ name, value }: CustomField) => ({
          name,
          value,
        }));
        expect(fields).toIncludeSameMembers(outputCustomFields);
      }
    });

    it('should return 422 for duplicate email', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['email'], {
        input: { ...mocker.system.user(), email: input.email },
      });
    });
  });
};
