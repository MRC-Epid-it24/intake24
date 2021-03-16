import { pick, times } from 'lodash';
import request from 'supertest';
import { Role, Permission } from '@/db/models/system';
import { RoleRequest } from '@common/types/http';
import { mocker, suite, setPermission } from '@tests/integration/helpers';

export default (): void => {
  const baseUrl = '/api/admin/roles';

  let url: string;
  let invalidUrl: string;

  let input: RoleRequest;
  let updateInput: RoleRequest;
  let output: RoleRequest;
  let role: Role;

  beforeAll(async () => {
    input = mocker.role();
    updateInput = mocker.role();

    const permissionInput = times(3, () => mocker.permission());
    const permissions = await Permission.bulkCreate(permissionInput);
    updateInput.permissions = permissions.map((item: Permission) => item.id);

    const { name } = input;
    output = { ...updateInput, name };

    role = await Role.create(input);

    url = `${baseUrl}/${role.id}`;
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
      await setPermission(['acl', 'roles-edit']);
    });

    it('should return 422 when missing input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['name', 'displayName', 'permissions']);
    });

    it('should return 422 when invalid input data', async () => {
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
      const { status } = await request(suite.app)
        .put(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(404);
    });

    it('should return 200 and data/refs', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['data', 'refs']);

      const data = {
        ...body.data,
        permissions: body.data.permissions.map((item: Permission) => item.id),
      };

      expect(pick(data, Object.keys(output))).toEqual(output);
    });
  });
};
