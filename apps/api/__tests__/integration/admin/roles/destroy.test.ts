import request from 'supertest';
import { RoleRequest } from '@intake24/common/types/http/admin';
import { mocker, suite, setPermission } from '@intake24/api-tests/integration/helpers';
import { Role } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/roles';

  let url: string;
  let invalidUrl: string;

  let input: RoleRequest;
  let role: Role;

  beforeAll(async () => {
    input = mocker.system.role();
    role = await Role.create(input);

    url = `${baseUrl}/${role.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('delete', url);
  });

  describe('authenticated / authorized', () => {
    beforeAll(async () => {
      await setPermission(['acl', 'roles|delete']);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('delete', invalidUrl);
    });

    it('should return 204 and no content', async () => {
      await suite.sharedTests.assertRecordDeleted('delete', url);
    });
  });
};
