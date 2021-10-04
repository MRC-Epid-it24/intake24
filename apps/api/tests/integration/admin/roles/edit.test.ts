import { pick } from 'lodash';
import request from 'supertest';
import { RoleRequest } from '@common/types/http/admin';
import { mocker, suite, setPermission } from '@tests/integration/helpers';
import { Role } from '@api/db/models/system';

export default (): void => {
  const baseUrl = '/api/admin/roles';

  let url: string;
  let invalidUrl: string;

  let input: RoleRequest;
  let role: Role;

  beforeAll(async () => {
    input = mocker.system.role();
    role = await Role.create(input);

    url = `${baseUrl}/${role.id}/edit`;
    invalidUrl = `${baseUrl}/999999/edit`;
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission('acl');

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission(['acl', 'roles-edit']);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .get(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(404);
    });

    it('should return 200 and data/refs', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['data', 'refs']);
      expect(pick(body.data, Object.keys(input))).toEqual(input);
    });
  });
};
