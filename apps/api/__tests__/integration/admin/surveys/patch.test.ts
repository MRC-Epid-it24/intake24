import { SurveyRequest } from '@intake24/common/types/http/admin';
import { mocker, suite, SetSecurableOptions } from '@intake24/api-tests/integration/helpers';
import { Survey } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/surveys';
  const permissions = ['surveys', 'surveys|edit'];

  let url: string;
  let invalidUrl: string;

  let input: SurveyRequest;
  let updateInput: SurveyRequest;
  let survey: Survey;

  let securable: SetSecurableOptions;

  let refreshSurveyRecord: () => SurveyRequest;

  beforeAll(async () => {
    input = mocker.system.survey();
    updateInput = mocker.system.survey();

    refreshSurveyRecord = () => {
      const mock = mocker.system.survey();
      const { slug } = input;
      return { ...mock, slug, supportEmail: mock.supportEmail.toLowerCase() };
    };

    survey = await Survey.create({
      ...input,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
    });

    securable = { securableId: survey.id, securableType: 'Survey' };

    url = `${baseUrl}/${survey.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('patch', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('patch', url, []);
    });

    it('should return 422 for invalid input data', async () => {
      const invalidInput = {
        name: { name: 'survey name' },
        state: 10,
        startDate: 'notValidDate',
        endDate: 100,
        surveySchemeId: '999999',
        localeId: 10,
        supportEmail: 'thisIsNotValidEmail',
        allowGenUsers: 'no',
        numberOfSubmissionsForFeedback: 'number',
        storeUserSessionOnServer: 'yes',
        maximumDailySubmissions: 'NaN',
        minimumSubmissionInterval: { nan: 5 },
        authUrlTokenCharset: ['an array charset'],
        authUrlTokenLength: 1,
        searchSortingAlgorithm: false,
        searchMatchScoreWeight: { number: 20 },
        surveySchemeOverrides: {
          meals: ['shouldBeProperlyFormatMealList'],
          questions: { value: 'not a valid overrides object' },
        },
        userPersonalIdentifiers: [true],
        userCustomFields: 'not a boolean',
      };

      const fields = [
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
        'surveySchemeOverrides',
        'userPersonalIdentifiers',
        'userCustomFields',
      ];

      await suite.sharedTests.assertInvalidInput('patch', url, fields, { input: invalidInput });
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('patch', invalidUrl, { input: updateInput });
    });

    it('should return 200 and data', async () => {
      const updateInput1 = refreshSurveyRecord();

      await suite.sharedTests.assertRecordUpdated('patch', url, updateInput1);
    });
  });

  describe('authenticated / securables authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(['surveys']);
    });

    it('should return 200 and data when securable set', async () => {
      await suite.util.setSecurable({ ...securable, action: ['edit'] });

      const updateInput2 = refreshSurveyRecord();

      await suite.sharedTests.assertRecordUpdated('patch', url, updateInput2);
    });

    it('should return 200 and data when owner set', async () => {
      await suite.util.setSecurable(securable);
      await survey.update({ ownerId: suite.data.system.user.id });

      const updateInput3 = refreshSurveyRecord();

      await suite.sharedTests.assertRecordUpdated('patch', url, updateInput3);
    });
  });
};
