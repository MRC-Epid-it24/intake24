import { pick } from 'lodash';
import request from 'supertest';
import { PermissionRequest } from '@intake24/common/types/http/admin';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { Permission } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/permissions';
  const permissions = ['acl', 'permissions', 'permissions|read'];

  let url: string;
  let invalidUrl: string;

  let input: PermissionRequest;
  let permission: Permission;

  beforeAll(async () => {
    input = mocker.system.permission();
    permission = await Permission.create(input);

    url = `${baseUrl}/${permission.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
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
      expect(pick(body, Object.keys(input))).toEqual(input);
    });
  });
};
