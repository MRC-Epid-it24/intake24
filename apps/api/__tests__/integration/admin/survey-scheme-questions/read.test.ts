import type { SurveySchemeQuestionCreationAttributes } from '@intake24/db';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { SurveySchemeQuestion } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/survey-scheme-questions';
  const permissions = ['survey-scheme-questions', 'survey-scheme-questions|read'];

  let url: string;
  let invalidUrl: string;

  let input: SurveySchemeQuestionCreationAttributes;
  let output: SurveySchemeQuestionCreationAttributes;
  let schemeQuestion: SurveySchemeQuestion;

  beforeAll(async () => {
    input = mocker.system.surveySchemeQuestion();
    schemeQuestion = await SurveySchemeQuestion.create(input);
    output = { ...input };

    url = `${baseUrl}/${schemeQuestion.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('get', invalidUrl);
    });

    it('should return 200 and data', async () => {
      await suite.sharedTests.assertRecord('get', url, output);
    });
  });
};
