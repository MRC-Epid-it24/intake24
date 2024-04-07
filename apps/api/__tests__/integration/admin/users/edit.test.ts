import { omit, pick } from 'lodash';
import request from 'supertest';

import type { CustomField } from '@intake24/common/types';
import type { CreateUserRequest, UpdateUserRequest } from '@intake24/common/types/http/admin';
import type { User } from '@intake24/db';
import ioc from '@intake24/api/ioc';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const baseUrl = '/api/admin/users';
  const permissions = ['acl', 'users', 'users|edit'];

  let url: string;
  let invalidUrl: string;

  let input: CreateUserRequest;
  let output: UpdateUserRequest;
  let user: User;

  beforeAll(async () => {
    input = mocker.system.user();
    user = await ioc.cradle.adminUserService.create(input);
    output = omit(input, ['password', 'passwordConfirm']);

    url = `${baseUrl}/${user.id}/edit`;
    invalidUrl = `${baseUrl}/999999/edit`;
  });

  it('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('get', invalidUrl);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(200);

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
  });
};
