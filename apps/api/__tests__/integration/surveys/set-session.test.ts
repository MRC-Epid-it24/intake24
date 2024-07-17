import { randomUUID } from 'node:crypto';

import { pick } from 'lodash';
import request from 'supertest';

import type { SurveyState } from '@intake24/common/types';
import type { UserSurveySessionCreationAttributes } from '@intake24/db';
import { suite } from '@intake24/api-tests/integration/helpers';

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
      submissionTime: null,
      uxSessionId: randomUUID(),
      flags: ['prompt-1-acknowledged', 'prompt-2-acknowledged'],
      customPromptAnswers: {},
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
    await suite.sharedTests.assertMissingAuthorization('post', invalidUrl, {
      bearer: 'respondent',
    });
  });

  it(`should return 403 when user session disabled`, async () => {
    await suite.data.system.survey.update({ session: { store: false, age: '12h', fixed: '1d+0h' } });

    await suite.sharedTests.assertMissingAuthorization('post', url, {
      bearer: 'respondent',
      input,
    });
  });

  describe('user session enabled', () => {
    beforeAll(async () => {
      await suite.data.system.survey.update({ session: { store: true, age: '12h', fixed: '1d+0h' } });
    });

    it('should return 400 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['sessionData'], {
        bearer: 'respondent',
      });
    });

    it('should return 400 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['sessionData'], {
        bearer: 'respondent',
        input: { sessionData: 'InvalidSurveyState' },
      });
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
