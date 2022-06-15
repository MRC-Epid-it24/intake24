import type { SurveySchemeQuestionCreationAttributes } from '@intake24/common/types/models';
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
      await suite.sharedTests.assertInvalidInput('put', url, ['question']);
    });

    it('should return 422 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput('put', url, ['question'], {
        input: { question: { name: 'missingProps' } },
      });
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('put', invalidUrl, { input: updateInput });
    });

    it('should return 200 and data', async () => {
      await suite.sharedTests.assertRecordUpdated('put', url, updateInput, { input: updateInput });
    });
  });
};
