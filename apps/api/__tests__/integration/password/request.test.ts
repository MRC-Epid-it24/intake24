import request from 'supertest';

import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/password';

  it('should return 422 for missing input data', async () => {
    await suite.sharedTests.assertInvalidInput('post', url, ['email', 'captcha'], {
      bearer: undefined,
    });
  });

  it(`should return 422 for invalid input data`, async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .send({ email: 'notAnEmail', captcha: [] });

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys(['email', 'captcha']);
  });

  it('should return 200 for valid email', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .send({ email: 'testUser@example.com', captcha: 'captchaToken' });

    expect(status).toBe(200);
    expect(body).toBeEmpty();
  });

  it('should return 200 for invalid email', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .send({ email: 'emailNotInDatabase@example.com', captcha: 'captchaToken' });

    expect(status).toBe(200);
    expect(body).toBeEmpty();
  });
};
