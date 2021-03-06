import { pick } from 'lodash';
import request from 'supertest';
import { Permission } from '@/db/models/system';
import { PermissionRequest } from '@common/types/http';
import { mocker, suite, setPermission } from '../../helpers';

export default (): void => {
  const baseUrl = '/api/admin/permissions';

  let url: string;
  let invalidUrl: string;

  let input: PermissionRequest;
  let updateInput: PermissionRequest;
  let output: PermissionRequest;
  let permission: Permission;

  beforeAll(async () => {
    input = mocker.permission();
    updateInput = mocker.permission();

    const { name } = input;
    output = { ...updateInput, name };

    permission = await Permission.create(input);

    url = `${baseUrl}/${permission.id}`;
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
      await setPermission(['acl', 'permissions-edit']);
    });

    it('should return 422 when missing input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['name', 'displayName']);
    });

    it('should return 422 when invalid input data', async () => {
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
      expect(pick(body.data, Object.keys(output))).toEqual(output);
    });
  });
};
