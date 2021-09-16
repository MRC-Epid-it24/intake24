import { CustomField } from '@common/types';
import { pick, omit } from 'lodash';
import request from 'supertest';
import { CreateUserRequest, UpdateUserRequest } from '@common/types/http/admin';
import { mocker, suite, setPermission } from '@tests/integration/helpers';

export default (): void => {
  const url = '/api/admin/users';

  let input: CreateUserRequest;
  let output: Omit<UpdateUserRequest, 'permissions' | 'roles'>;

  beforeAll(async () => {
    input = mocker.system.user();
    output = {
      ...omit(input, ['password', 'passwordConfirm', 'permissions', 'roles']),
      email: input.email?.toLocaleLowerCase(),
    };
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).post(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission('acl');

    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission(['acl', 'users-create']);
    });

    it('should return 422 when missing input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['password', 'passwordConfirm', 'permissions', 'roles']);
    });

    it('should return 422 when invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          email: 'invalidEmailFormat',
          multiFactorAuthentication: 10,
          emailNotifications: 'string',
          smsNotifications: [100],
          customFields: 'invalidCustomFields',
          permissions: [1, 'invalidId', 2],
          roles: [1, 'invalidId', 2],
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys([
        'email',
        'password',
        'passwordConfirm',
        'multiFactorAuthentication',
        'emailNotifications',
        'smsNotifications',
        'customFields',
        'permissions',
        'roles',
      ]);
    });

    it('should return 201 and new resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(status).toBe(201);
      expect(body).toContainAllKeys(['data']);

      // Extract custom fields for non-order specific comparison
      const { customFields: resCustomFields, ...data } = body.data;
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

    it('should return 422 when duplicate email', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ ...mocker.system.user(), email: input.email });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['email']);
    });
  });
};
