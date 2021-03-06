import request from 'supertest';
import ioc from '@/ioc';
import { CreateUserRequest } from '@common/types/http';
import { User } from '@/db/models/system';
import { mocker, suite, setPermission } from '../../helpers';

export default (): void => {
  const baseUrl = '/api/admin/users';

  let url: string;
  let invalidUrl: string;

  let input: CreateUserRequest;
  let user: User;

  beforeAll(async () => {
    input = mocker.user();
    user = await ioc.cradle.userService.create(input);

    url = `${baseUrl}/${user.id}`;
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
      await setPermission(['acl', 'users-delete']);
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
