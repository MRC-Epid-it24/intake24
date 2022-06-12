import request from 'supertest';
import { pick } from 'lodash';
import { suite } from '@intake24/api-tests/integration/helpers';
import { UserSurveySessionCreationAttributes } from '@intake24/common/types/models';
import { UserSurveySession } from '@intake24/db';

export default () => {
  let url: string;
  let invalidUrl: string;

  beforeAll(async () => {
    url = `/api/surveys/${suite.data.system.survey.slug}/session`;
    invalidUrl = `/api/surveys/invalid-survey/session`;
  });

  it('should return 401 when no / invalid token', async () => {
    await suite.sharedTests.assertMissingAuthentication('get', url);
  });

  it(`should return 403 when survey record (+survey permissions) doesn't exist`, async () => {
    const { status } = await request(suite.app)
      .get(invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(403);
  });

  it(`should return 403 when user session disabled`, async () => {
    await suite.data.system.survey.update({ storeUserSessionOnServer: false });

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(403);
  });

  describe('user session enabled', () => {
    beforeAll(async () => {
      await suite.data.system.survey.update({ storeUserSessionOnServer: true });
    });

    it(`should return 404 when no survey session data`, async () => {
      const { status } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(404);
    });

    it('should return 200 and survey session data', async () => {
      const { userId } = suite.data.system.respondent;
      const surveyId = suite.data.system.survey.id;

      const input: UserSurveySessionCreationAttributes = {
        userId,
        surveyId,
        sessionData: {
          schemeId: 'SurveyState',
          startTime: new Date(),
          endTime: new Date(),
          flags: [],
          meals: [],
          nextFoodId: 0,
          nextMealId: 0,
          customPromptAnswers: {},
          continueButtonEnabled: false,
          selection: { element: null, mode: 'auto' },
        },
      };
      await UserSurveySession.create(input);

      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
      expect(pick(body, Object.keys(input))).toEqual({
        ...input,
        sessionData: {
          ...input.sessionData,
          startTime: input.sessionData.startTime?.toISOString(),
          endTime: input.sessionData.endTime?.toISOString(),
        },
      });
    });
  });
};
