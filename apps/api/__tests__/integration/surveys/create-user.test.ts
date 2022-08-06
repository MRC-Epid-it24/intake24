import jwt from 'jsonwebtoken';
import request from 'supertest';

import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  let url: string;
  let invalidUrl: string;

  let payload: { user: string; redirect: string };
  const secret = 'aSuperSecret';
  let token: string;

  beforeAll(async () => {
    payload = { user: 'userIdentifier001', redirect: 'https://redirect-me.here' };
    token = jwt.sign(payload, secret, { expiresIn: '15m' });

    url = `/api/surveys/${suite.data.system.survey.slug}/create-user`;
    invalidUrl = `/api/surveys/invalid-survey/create-user`;
  });

  it(`should return 422 for missing JWT in query params`, async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .send();

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys(['params']);
  });

  it(`should return 422 for malformed JWT in query params`, async () => {
    const { status, body } = await request(suite.app)
      .post(`${url}?params=this-is-not-a-jwt-token`)
      .set('Accept', 'application/json')
      .send();

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys(['params']);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    const { status } = await request(suite.app)
      .post(`${invalidUrl}?params=${token}`)
      .set('Accept', 'application/json')
      .send();

    expect(status).toBe(404);
  });

  it(`should return 403 when user generation disabled`, async () => {
    await suite.data.system.survey.update({ allowGenUsers: false, genUserKey: null });

    const { status } = await request(suite.app)
      .post(`${url}?params=${token}`)
      .set('Accept', 'application/json')
      .send();

    expect(status).toBe(403);
  });

  it(`should return 403 when JWT secret is not set in survey settings`, async () => {
    await suite.data.system.survey.update({ allowGenUsers: true, genUserKey: null });

    const { status } = await request(suite.app)
      .post(`${url}?params=${token}`)
      .set('Accept', 'application/json')
      .send();

    expect(status).toBe(403);
  });

  describe('for correct survey settings', () => {
    beforeAll(async () => {
      await suite.data.system.survey.update({ allowGenUsers: true, genUserKey: secret });
    });

    it(`should return 403 for invalid JWT secret`, async () => {
      const invalidToken = jwt.sign(payload, 'invalidSecret', { expiresIn: '5m' });

      const { status } = await request(suite.app)
        .post(`${url}?params=${invalidToken}`)
        .set('Accept', 'application/json')
        .send();

      expect(status).toBe(403);
    });

    it(`should return 400 when payload is not an object`, async () => {
      const nonObjectToken = jwt.sign('notAnObjectPayload', secret);

      const { status } = await request(suite.app)
        .post(`${url}?params=${nonObjectToken}`)
        .set('Accept', 'application/json')
        .send();

      expect(status).toBe(400);
    });

    it(`should return 400 when missing claim (user)`, async () => {
      const { user, ...rest } = payload;
      const missingClaimToken = jwt.sign(rest, secret, { expiresIn: '5m' });

      const { status } = await request(suite.app)
        .post(`${url}?params=${missingClaimToken}`)
        .set('Accept', 'application/json')
        .send();

      expect(status).toBe(400);
    });

    it(`should return 400 when missing claim (redirect)`, async () => {
      const { redirect, ...rest } = payload;
      const missingClaimToken = jwt.sign(rest, secret, { expiresIn: '5m' });

      const { status } = await request(suite.app)
        .post(`${url}?params=${missingClaimToken}`)
        .set('Accept', 'application/json')
        .send();

      expect(status).toBe(400);
    });

    it('should return 200 and respondent record', async () => {
      await suite.data.system.survey.update({ allowGenUsers: true, genUserKey: secret });

      const { status, body } = await request(suite.app)
        .post(`${url}?params=${token}`)
        .set('Accept', 'application/json')
        .send();

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['userId', 'redirect', 'authToken']);
    });

    it('should return 200 and same respondent record, should be idempotent', async () => {
      await suite.data.system.survey.update({ allowGenUsers: true, genUserKey: secret });

      const { status, body } = await request(suite.app)
        .post(`${url}?params=${token}`)
        .set('Accept', 'application/json')
        .send();

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['userId', 'redirect', 'authToken']);
    });
  });
};
