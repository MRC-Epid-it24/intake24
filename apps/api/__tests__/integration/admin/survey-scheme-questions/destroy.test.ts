import request from 'supertest';
import { SurveySchemeQuestionCreationAttributes } from '@intake24/common/types/models';
import { mocker, suite, setPermission } from '@intake24/api-tests/integration/helpers';
import { SurveySchemeQuestion } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/survey-scheme-questions';

  let url: string;
  let invalidUrl: string;

  let input: SurveySchemeQuestionCreationAttributes;
  let schemeQuestion: SurveySchemeQuestion;

  beforeAll(async () => {
    input = mocker.system.surveySchemeQuestion();
    schemeQuestion = await SurveySchemeQuestion.create(input);

    url = `${baseUrl}/${schemeQuestion.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('delete', url);
  });

  describe('authenticated / authorized', () => {
    beforeAll(async () => {
      await setPermission('survey-scheme-questions|delete');
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('delete', invalidUrl);
    });

    it('should return 204 and no content', async () => {
      await suite.sharedTests.assertRecordDeleted('delete', url);
    });
  });
};
