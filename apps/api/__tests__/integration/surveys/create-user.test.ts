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

  it(`should return 422 for missing JWT in query token`, async () => {
    await suite.sharedTests.assertInvalidInput('post', url, ['token'], {
      bearer: null,
    });
  });

  it(`should return 422 for malformed JWT in query token`, async () => {
    await suite.sharedTests.assertInvalidInput(
      'post',
      `${url}?token=this-is-not-a-jwt-token`,
      ['token'],
      { bearer: null }
    );
  });

  it(`should return 404 when record doesn't exist`, async () => {
    await suite.sharedTests.assertMissingRecord('post', `${invalidUrl}?token=${token}`, {
      bearer: null,
    });
  });

  it(`should return 403 when user generation disabled`, async () => {
    await suite.data.system.survey.update({ allowGenUsers: false, genUserKey: null });

    await suite.sharedTests.assertMissingAuthorization('post', `${url}?token=${token}`, {
      bearer: null,
    });
  });

  it(`should return 403 when JWT secret is not set in survey settings`, async () => {
    await suite.data.system.survey.update({ allowGenUsers: true, genUserKey: null });

    await suite.sharedTests.assertMissingAuthorization('post', `${url}?token=${token}`, {
      bearer: null,
    });
  });

  describe('for correct survey settings', () => {
    beforeAll(async () => {
      await suite.data.system.survey.update({ allowGenUsers: true, genUserKey: secret });
    });

    it(`should return 403 for invalid JWT secret`, async () => {
      const invalidToken = jwt.sign(payload, 'invalidSecret', { expiresIn: '5m' });

      await suite.sharedTests.assertMissingAuthorization('post', `${url}?token=${invalidToken}`, {
        bearer: null,
      });
    });

    it(`should return 400 when payload is not an object`, async () => {
      const nonObjectToken = jwt.sign('notAnObjectPayload', secret);

      const { status } = await request(suite.app)
        .post(`${url}?token=${nonObjectToken}`)
        .set('Accept', 'application/json')
        .send();

      expect(status).toBe(400);
    });

    it(`should return 400 when missing claim (username)`, async () => {
      const { username, ...rest } = payload;
      const missingClaimToken = jwt.sign(rest, secret, { expiresIn: '5m' });

      const { status } = await request(suite.app)
        .post(`${url}?token=${missingClaimToken}`)
        .set('Accept', 'application/json')
        .send();

      expect(status).toBe(400);
    });

    it('should return 200 and respondent record', async () => {
      await suite.data.system.survey.update({ allowGenUsers: true, genUserKey: secret });

      const { status, body } = await request(suite.app)
        .post(`${url}?token=${token}`)
        .set('Accept', 'application/json')
        .send();

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['userId', 'username', 'authToken', 'redirectUrl']);
    });

    it('should return 200 and same respondent record, should be idempotent', async () => {
      await suite.data.system.survey.update({ allowGenUsers: true, genUserKey: secret });

      const { status, body } = await request(suite.app)
        .post(`${url}?token=${token}`)
        .set('Accept', 'application/json')
        .send();

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['userId', 'username', 'authToken', 'redirectUrl']);
    });
  });
};
