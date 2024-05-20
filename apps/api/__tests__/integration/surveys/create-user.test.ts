import jwt from 'jsonwebtoken';
import request from 'supertest';

import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  let url: string;
  let invalidUrl: string;

  let payload: { username: string; redirectUrl?: string };
  const secret = 'aSuperSecret';
  let token: string;

  beforeAll(async () => {
    payload = { username: 'userIdentifier001', redirectUrl: 'https://redirect-me.here' };
    token = jwt.sign(payload, secret, { expiresIn: '15m' });

    url = `/api/surveys/${suite.data.system.survey.slug}/create-user`;
    invalidUrl = `/api/surveys/invalid-survey/create-user`;
  });

  it(`should return 400 for missing JWT in query token`, async () => {
    await suite.sharedTests.assertInvalidInput('post', url, ['token'], {
      bearer: null,
    });
  });

  it(`should return 400 for malformed JWT in query token`, async () => {
    await suite.sharedTests.assertInvalidInput('post', url, ['token'], {
      bearer: null,
      input: { token: 'this-is-not-a-jwt-token' },
    });
  });

  it(`should return 404 when record doesn't exist`, async () => {
    await suite.sharedTests.assertMissingRecord('post', invalidUrl, {
      bearer: null,
      input: { token },
    });
  });

  it(`should return 403 when user generation disabled`, async () => {
    await suite.data.system.survey.update({ allowGenUsers: false, genUserKey: null });

    await suite.sharedTests.assertMissingAuthorization('post', url, {
      bearer: null,
      input: { token },
    });
  });

  it(`should return 403 when JWT secret is not set in survey settings`, async () => {
    await suite.data.system.survey.update({ allowGenUsers: true, genUserKey: null });

    await suite.sharedTests.assertMissingAuthorization('post', url, {
      bearer: null,
      input: { token },
    });
  });

  describe('for correct survey settings', () => {
    beforeAll(async () => {
      await suite.data.system.survey.update({ allowGenUsers: true, genUserKey: secret });
    });

    it(`should return 403 for invalid JWT secret`, async () => {
      const invalidToken = jwt.sign(payload, 'invalidSecret', { expiresIn: '5m' });

      await suite.sharedTests.assertMissingAuthorization('post', url, {
        bearer: null,
        input: { token: invalidToken },
      });
    });

    it(`should return 400 when payload is not an object`, async () => {
      const nonObjectToken = jwt.sign('notAnObjectPayload', secret);

      const { status } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .send({ token: nonObjectToken });

      expect(status).toBe(400);
    });

    it(`should return 400 when missing claim (username)`, async () => {
      const { username, ...rest } = payload;
      await suite.sharedTests.assertInvalidInput('post', url, ['username'], {
        input: {
          token: jwt.sign(rest, secret, { expiresIn: '5m' }),
        },
      });
    });

    it(`should return 400 for invalid input data`, async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['username', 'password', 'redirectUrl'], {
        input: {
          token: jwt.sign({
            username: false,
            password: 'weak',
            redirectUrl: 'not-url',
          }, secret, { expiresIn: '5m' }),
        },
      });
    });

    it('should return 200 and respondent record', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .send({ token });

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['userId', 'username', 'authToken', 'redirectUrl']);
    });

    it('should return 200 and same respondent record, should be idempotent', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .send({ token });

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['userId', 'username', 'authToken', 'redirectUrl']);
    });

    it('should return 200 and respondent record (with password)', async () => {
      const tokenWithPassword = jwt.sign({
        username: 'userIdentifier002',
        password: 'aPassword132456',
        redirectUrl: 'https://redirect-me.here',
      }, secret, { expiresIn: '15m' });

      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .send({ token: tokenWithPassword });

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['userId', 'username', 'authToken', 'redirectUrl']);
    });
  });
};
