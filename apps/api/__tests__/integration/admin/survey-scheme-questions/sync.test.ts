import {
  SurveySchemeCreationAttributes,
  SurveySchemeQuestionCreationAttributes,
} from '@intake24/common/types/models';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { SurveyScheme, SurveySchemeQuestion } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/survey-scheme-questions';
  const permissions = ['survey-scheme-questions', 'survey-scheme-questions|sync'];

  let url: string;
  let invalidUrl: string;

  let schemeInput: SurveySchemeCreationAttributes;
  let schemeQuestionInput: SurveySchemeQuestionCreationAttributes;
  let syncInput: any;

  let scheme: SurveyScheme;
  let schemeQuestion: SurveySchemeQuestion;

  beforeAll(async () => {
    schemeInput = mocker.system.surveyScheme();
    schemeQuestionInput = mocker.system.surveySchemeQuestion();

    schemeInput = {
      ...schemeInput,
      questions: {
        ...schemeInput.questions,
        preMeals: [schemeQuestionInput.question],
      },
    };

    schemeQuestion = await SurveySchemeQuestion.create(schemeQuestionInput);
    scheme = await SurveyScheme.create(schemeInput);

    syncInput = {
      surveySchemeId: scheme.id,
      section: 'preMeals',
      question: {
        ...mocker.system.surveySchemeQuestion().question,
        id: schemeQuestionInput.question.id,
      },
    };

    url = `${baseUrl}/${schemeQuestion.id}/sync`;
    invalidUrl = `${baseUrl}/999999/sync`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, [
        'surveySchemeId',
        'section',
        'question',
      ]);
    });

    it('should return 422 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput(
        'post',
        url,
        ['surveySchemeId', 'section', 'question'],
        {
          input: {
            surveySchemeId: ['123456'],
            section: 'notValidSchemeSection',
            question: { name: 'missingProps' },
          },
        }
      );
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('post', invalidUrl, { input: syncInput });
    });

    it(`should return 404 when scheme record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('post', invalidUrl, {
        input: { ...syncInput, surveySchemeId: '987654' },
      });
    });

    it(`should return 404 when question is not in correct section`, async () => {
      await suite.sharedTests.assertMissingRecord('post', invalidUrl, {
        input: { ...syncInput, section: 'postMeals' },
      });
    });

    it(`should return 404 when question ID is not found in scheme questions set`, async () => {
      await suite.sharedTests.assertMissingRecord('post', invalidUrl, {
        input: { ...syncInput, question: { ...syncInput.question, id: 'invalidQuestionId' } },
      });
    });

    it('should return 200 and data', async () => {
      await suite.sharedTests.assertAcknowledged('post', url, { input: syncInput });
    });
  });
};
