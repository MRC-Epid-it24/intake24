import { SurveyRequest } from '@intake24/common/types/http/admin';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/surveys';

  let input: SurveyRequest;
  let output: SurveyRequest;

  beforeAll(async () => {
    input = mocker.system.survey();
    output = { ...input, supportEmail: input.supportEmail.toLowerCase() };
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url);
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission('surveys|create');
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, [
        'id',
        'name',
        'state',
        'startDate',
        'endDate',
        'surveySchemeId',
        'localeId',
        'supportEmail',
        'allowGenUsers',
        'storeUserSessionOnServer',
        'overrides',
      ]);
    });

    it('should return 422 for invalid input data', async () => {
      const invalidInput = {
        id: null,
        name: [2, 0],
        state: 10,
        startDate: 'notValidDate',
        endDate: 100,
        surveySchemeId: '999999',
        locale: 10,
        supportEmail: 'thisIsNotValidEmail',
        allowGenUsers: 'no',
        numberOfSubmissionsForFeedback: 'number',
        storeUserSessionOnServer: 'yes',
        maximumDailySubmissions: 'NaN',
        minimumSubmissionInterval: { nan: 5 },
        authUrlTokenCharset: 'abcabc',
        authUrlTokenLength: 'this is not a number',
        searchSortingAlgorithm: 'invalid-search-algorithm',
        searchMatchScoreWeight: 500,
        overrides: {
          meals: ['shouldBeProperlyFormatMealList'],
          questions: 'invalidQuestions',
        },
      };

      const fields = [
        'id',
        'name',
        'state',
        'startDate',
        'endDate',
        'surveySchemeId',
        'localeId',
        'supportEmail',
        'allowGenUsers',
        'numberOfSubmissionsForFeedback',
        'storeUserSessionOnServer',
        'maximumDailySubmissions',
        'minimumSubmissionInterval',
        'authUrlTokenCharset',
        'authUrlTokenLength',
        'searchSortingAlgorithm',
        'searchMatchScoreWeight',
        'overrides',
      ];

      await suite.sharedTests.assertInvalidInput('post', url, fields, { input: invalidInput });
    });

    it('should return 201 and new resource', async () => {
      await suite.sharedTests.assertRecordInserted('post', url, output, { input });
    });

    it('should return 422 for duplicate id', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['id'], {
        input: { ...mocker.system.survey(), id: input.id },
      });
    });

    it('should return 422 for duplicate name', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['name'], {
        input: { ...mocker.system.survey(), name: input.name },
      });
    });
  });
};
