import request from 'supertest';
import { pick } from 'lodash';
import { suite } from '@tests/integration/helpers';
import { UserSession } from '@/db/models/system';

export default (): void => {
  let url: string;
  let invalidUrl: string;

  beforeAll(async () => {
    url = `/api/surveys/${suite.data.survey.id}/session`;
    invalidUrl = `/api/surveys/invalid-survey/session`;
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it(`should return 403 when survey record (+survey permissions) doesn't exist`, async () => {
    const { status } = await request(suite.app)
      .get(invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(403);
  });

  it(`should return 403 when user session disabled`, async () => {
    await suite.data.survey.update({ storeUserSessionOnServer: false });

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(403);
  });

  describe('user session enabled', () => {
    beforeAll(async () => {
      await suite.data.survey.update({ storeUserSessionOnServer: true });
    });

    it(`should return 404 when no survey session data`, async () => {
      const { status } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(404);
    });

    it('should return 200 and survey session data', async () => {
      const { userId } = suite.data.respondent;
      const surveyId = suite.data.survey.id;

      const input = { userId, surveyId, sessionData: { schemeId: 'SurveyState' } };
      await UserSession.create(input);

      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
      expect(pick(body, Object.keys(input))).toEqual(input);
    });
  });
};
