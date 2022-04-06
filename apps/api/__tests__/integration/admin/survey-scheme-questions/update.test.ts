import { pick } from 'lodash';
import request from 'supertest';
import { SurveySchemeQuestionCreationAttributes } from '@intake24/common/types/models';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { SurveySchemeQuestion } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/survey-scheme-questions';
  const permissions = ['survey-scheme-questions', 'survey-scheme-questions|edit'];

  let url: string;
  let invalidUrl: string;

  let input: SurveySchemeQuestionCreationAttributes;
  let updateInput: SurveySchemeQuestionCreationAttributes;
  let schemeQuestion: SurveySchemeQuestion;

  beforeAll(async () => {
    input = mocker.system.surveySchemeQuestion();
    updateInput = mocker.system.surveySchemeQuestion();

    schemeQuestion = await SurveySchemeQuestion.create(input);

    url = `${baseUrl}/${schemeQuestion.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('put', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertMissingInput('put', url, ['question']);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ question: { name: 'missingProps' } });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['question']);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('put', invalidUrl, updateInput);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(200);
      expect(pick(body, Object.keys(updateInput))).toEqual(updateInput);
    });
  });
};
