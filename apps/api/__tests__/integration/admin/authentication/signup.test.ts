import request from 'supertest';

import securityConfig from '@intake24/api/config/security';
import ioc from '@intake24/api/ioc';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/auth/signup';

  const input = {
    name: 'A Researcher',
    phone: '0123456789',
    email: 'researcher@example.com',
    emailConfirm: 'researcher@example.com',
    password: 'newPassword123',
    passwordConfirm: 'newPassword123',
    terms: true,
  };

  it('should return 422 for missing input data', async () => {
    await suite.sharedTests.assertInvalidInput('post', url, [
      'name',
      'email',
      'emailConfirm',
      'password',
      'passwordConfirm',
      'terms',
    ]);
  });

  it('should return 422 for invalid input data', async () => {
    const invalidInput = {
      name: ['name should be string'],
      phone: { value: 'phone should be string' },
      email: 'thisIsNotAnEmailAddress',
      emailConfirm: 'notMatching@email.com',
      password: 'tooSimple',
      passwordConfirm: 'notMatchingTooSimple',
      terms: false,
    };

    await suite.sharedTests.assertInvalidInput(
      'post',
      url,
      ['name', 'phone', 'email', 'emailConfirm', 'password', 'passwordConfirm', 'terms'],
      { input: invalidInput }
    );
  });

  it('should return 403 when sign-ups disabled', async () => {
    ioc.cradle.aclConfig.signup.enabled = false;

    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .send(input);

    expect(status).toBe(403);
  });

  describe('Sign-ups enabled', () => {
    beforeAll(async () => {
      ioc.cradle.aclConfig.signup.enabled = true;
    });

    it('should return 200, access token & refresh cookie', async () => {
      const res = await request(suite.app).post(url).set('Accept', 'application/json').send(input);

      expect(res.status).toBe(200);
      expect(res.body).toContainAllKeys(['accessToken']);

      expect(res.get('Set-Cookie').length).toBeGreaterThanOrEqual(1);
      expect(
        res
          .get('Set-Cookie')
          .some((cookie) => cookie.split('=')[0] === securityConfig.jwt.admin.cookie.name)
      ).toBeTrue();
    });
  });

  /* it('Invalid credentials should return 401', async () => {
    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .send({ email: 'testUser@example.com', password: 'invalidPassword' });

    expect(status).toBe(401);
  });

  it('Valid credentials should return 200, access token & refresh cookie', async () => {
    const res = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .send({ email: 'testUser@example.com', password: 'testUserPassword' });

    expect(res.status).toBe(200);
    expect(res.body).toContainAllKeys(['accessToken']);

    expect(res.get('Set-Cookie').length).toBeGreaterThanOrEqual(1);
    expect(
      res
        .get('Set-Cookie')
        .some((cookie) => cookie.split('=')[0] === securityConfig.jwt.admin.cookie.name)
    ).toBeTrue();
  }); */
};
