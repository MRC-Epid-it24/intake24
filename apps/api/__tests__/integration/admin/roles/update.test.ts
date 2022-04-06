import { pick, times } from 'lodash';
import request from 'supertest';
import { RoleRequest } from '@intake24/common/types/http/admin';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { Role, Permission } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/roles';
  const permissions = ['acl', 'roles', 'roles|edit'];

  let url: string;
  let invalidUrl: string;

  let input: RoleRequest;
  let updateInput: RoleRequest;
  let output: RoleRequest;
  let role: Role;

  beforeAll(async () => {
    input = mocker.system.role();
    updateInput = mocker.system.role();

    const permissionInput = times(3, () => mocker.system.permission());
    const permissionsRecords = await Permission.bulkCreate(permissionInput);
    updateInput.permissions = permissionsRecords.map((item: Permission) => item.id);

    const { name } = input;
    output = { ...updateInput, name };

    role = await Role.create(input);

    url = `${baseUrl}/${role.id}`;
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
      await suite.sharedTests.assertMissingInput('put', url, [
        'name',
        'displayName',
        'permissions',
      ]);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ name: '', displayName: '', permissions: [1, 'invalidId', 2] });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['name', 'displayName', 'permissions']);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('put', invalidUrl, updateInput);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(200);

      const data = {
        ...body,
        permissions: body.permissions.map((item: Permission) => item.id),
      };

      expect(pick(data, Object.keys(output))).toEqual(output);
    });
  });
};
