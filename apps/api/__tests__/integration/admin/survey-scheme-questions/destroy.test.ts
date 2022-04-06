import { SurveySchemeQuestionCreationAttributes } from '@intake24/common/types/models';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { SurveySchemeQuestion } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/survey-scheme-questions';
  const permissions = ['survey-scheme-questions', 'survey-scheme-questions|delete'];

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
    await suite.sharedTests.assert401and403('delete', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('delete', invalidUrl);
    });

    it('should return 204 and no content', async () => {
      await suite.sharedTests.assertRecordDeleted('delete', url);
    });
  });
};
