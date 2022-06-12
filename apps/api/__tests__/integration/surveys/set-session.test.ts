import request from 'supertest';
import { pick } from 'lodash';
import { suite } from '@intake24/api-tests/integration/helpers';
import { UserSurveySessionCreationAttributes } from '@intake24/common/types/models/system';
import { SurveyState } from '@intake24/common/types';

export default () => {
  let url: string;
  let invalidUrl: string;

  let input: Pick<UserSurveySessionCreationAttributes, 'sessionData'>;

  beforeAll(async () => {
    url = `/api/surveys/${suite.data.system.survey.slug}/session`;
    invalidUrl = `/api/surveys/invalid-survey/session`;

    const sessionData: SurveyState = {
      schemeId: 'schemeId',
      startTime: new Date(),
      endTime: new Date(),
      flags: ['flag-1', 'flag-2'],
      customPromptAnswers: {},
      continueButtonEnabled: false,
      nextFoodId: 0,
      nextMealId: 0,
      selection: {
        element: null,
        mode: 'auto',
      },
      meals: [],
    };

    input = { sessionData };
  });

  it('should return 401 when no / invalid token', async () => {
    await suite.sharedTests.assertMissingAuthentication('post', url);
  });

  it(`should return 403 when survey record (+survey permissions) doesn't exist`, async () => {
    const { status } = await request(suite.app)
      .post(invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(403);
  });

  it(`should return 403 when user session disabled`, async () => {
    await suite.data.system.survey.update({ storeUserSessionOnServer: false });

    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent)
      .send(input);

    expect(status).toBe(403);
  });

  describe('user session enabled', () => {
    beforeAll(async () => {
      await suite.data.system.survey.update({ storeUserSessionOnServer: true });
    });

    it('should return 422 for missing input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['sessionData']);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent)
        .send({ sessionData: 'InvalidSurveyState' });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['sessionData']);
    });

    it('should return 200 and survey session data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent)
        .send(input);

      const { sessionData, ...rest } = body;

      const bodyOutput = {
        ...rest,
        sessionData: {
          ...sessionData,
          startTime: new Date(sessionData.startTime),
          endTime: new Date(sessionData.endTime),
        },
      };

      expect(status).toBe(200);
      expect(pick(bodyOutput, Object.keys(input))).toEqual(input);
    });
  });
};
