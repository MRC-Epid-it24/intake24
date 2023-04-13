import type { SurveySchemeQuestionCreationAttributes } from '@intake24/db';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/survey-scheme-questions';
  const permissions = ['survey-scheme-questions', 'survey-scheme-questions|create'];

  let input: SurveySchemeQuestionCreationAttributes;
  let output: SurveySchemeQuestionCreationAttributes;

  beforeAll(async () => {
    input = mocker.system.surveySchemeQuestion();
    output = { ...input };
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['question']);
    });

    it('should return 422 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['question'], {
        input: { question: 'invalidQuestionPromptProps' },
      });
    });

    it('should return 201 and new resource', async () => {
      await suite.sharedTests.assertRecordInserted('post', url, output, { input });
    });

    it('should return 422 for duplicate questionId', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['question'], {
        input: {
          ...mocker.system.surveySchemeQuestion().question,
          id: input.question.id,
        },
      });
    });
  });
};
