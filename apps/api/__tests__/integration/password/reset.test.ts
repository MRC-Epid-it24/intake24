import request from 'supertest';
import { suite } from '@intake24/api-tests/integration/helpers';
import ioc from '@intake24/api/ioc';
import { UserPasswordReset } from '@intake24/db';
import { sleep } from '@intake24/api/util';

let dateNowSpy: jest.SpyInstance;

export default () => {
  const url = '/api/password/reset';

  let userId: string;
  let email: string;
  let token: string;

  beforeAll(async () => {
    const user = await ioc.cradle.adminUserService.create({
      email: 'testUserReset@example.com',
      password: 'testUserResetPassword',
      permissions: [],
      roles: [],
    });

    const { id, email: userEmail } = user;
    if (!userEmail) throw Error('User email not found.');

    userId = id;
    email = userEmail;

    await UserPasswordReset.destroy({ where: { userId } });

    await request(suite.app)
      .post('/api/password')
      .set('Accept', 'application/json')
      .send({ email, recaptcha: 'recaptchaToken' });

    await sleep(1000); // TODO: this should wait until the job is done
    const reset = await UserPasswordReset.findOne({ where: { userId } });
    if (!reset) throw Error('Password reset not created.');

    token = reset.token;
  });

  it('should return 422 for missing input data', async () => {
    await suite.sharedTests.assertInvalidInput(
      'post',
      url,
      ['email', 'token', 'password', 'passwordConfirm'],
      { bearer: undefined }
    );
  });

  it(`should return 422 for invalid input data`, async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .send({
        email: 'notAnEmail',
        token: [true],
        password: 'tooShort',
        passwordConfirm: 'notMatching',
      });

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys(['email', 'token', 'password', 'passwordConfirm']);
  });

  it('should return 422 for invalid token', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .send({
        email,
        token: 'invalidToken',
        password: 'newPassword123',
        passwordConfirm: 'newPassword123',
      });

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys(['token']);
  });

  describe('shift time forward to expire token', () => {
    beforeAll(() => {
      const timeShift = Date.now() + ioc.cradle.securityConfig.passwords.expiresIn;
      dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => timeShift);
    });

    it('should return 422 for expired token ', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .send({
          email,
          token,
          password: 'newPassword123',
          passwordConfirm: 'newPassword123',
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['token']);
    });

    afterAll(() => {
      dateNowSpy.mockRestore();
    });
  });

  it('should return 200', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .send({
        email,
        token,
        password: 'newPassword123',
        passwordConfirm: 'newPassword123',
      });

    expect(status).toBe(200);
    expect(body).toBeEmpty();
  });
};
