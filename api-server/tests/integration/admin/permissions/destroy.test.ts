import request from 'supertest';
import { Permission } from '@/db/models/system';
import { PermissionRequest } from '@common/types/http';
import { mocker, suite, setPermission } from '../../helpers';

export default (): void => {
  const baseUrl = '/api/admin/permissions';

  let url: string;
  let invalidUrl: string;

  let input: PermissionRequest;
  let permission: Permission;

  beforeAll(async () => {
    input = mocker.permission();
    permission = await Permission.create(input);

    url = `${baseUrl}/${permission.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).delete(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission('acl');

    const { status } = await request(suite.app)
      .delete(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission(['acl', 'permissions-delete']);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .delete(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(404);
    });

    it('should return 204 and no content', async () => {
      const { status, body } = await request(suite.app)
        .delete(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(204);
      expect(body).toBeEmpty();
    });
  });
};
