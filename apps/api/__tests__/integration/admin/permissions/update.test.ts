import request from 'supertest';
import { PermissionRequest } from '@intake24/common/types/http/admin';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { Permission } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/permissions';
  const permissions = ['acl', 'permissions', 'permissions|edit'];

  let url: string;
  let invalidUrl: string;

  let input: PermissionRequest;
  let updateInput: PermissionRequest;
  let output: PermissionRequest;
  let permission: Permission;

  beforeAll(async () => {
    input = mocker.system.permission();
    updateInput = mocker.system.permission();

    const { name } = input;
    output = { ...updateInput, name };

    permission = await Permission.create(input);

    url = `${baseUrl}/${permission.id}`;
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
      await suite.sharedTests.assertMissingInput('put', url, ['name', 'displayName']);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ name: '', displayName: '' });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['name', 'displayName']);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('put', invalidUrl, { input: updateInput });
    });

    it('should return 200 and data', async () => {
      await suite.sharedTests.assertRecordUpdated('put', url, output, { input: updateInput });
    });
  });
};
