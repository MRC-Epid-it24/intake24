import { pick } from 'lodash';
import request from 'supertest';
import { SurveyRequest } from '@intake24/common/types/http/admin';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { Survey } from '@intake24/db';
import { surveyStaff } from '@intake24/common/security';
import { StaffUpdateSurveyFields, staffUpdateSurveyFields } from '@intake24/common/types/models';

export default () => {
  const baseUrl = '/api/admin/surveys';

  let url: string;
  let invalidUrl: string;

  let input: SurveyRequest;
  let updateInput: Pick<SurveyRequest, StaffUpdateSurveyFields>;
  let output: Pick<SurveyRequest, StaffUpdateSurveyFields | 'id'>;
  let survey: Survey;

  beforeAll(async () => {
    input = mocker.system.survey();
    updateInput = pick(mocker.system.survey(), staffUpdateSurveyFields);

    const { id } = input;
    output = { ...updateInput, id, supportEmail: updateInput.supportEmail.toLowerCase() };

    survey = await Survey.create({
      ...input,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
    });

    url = `${baseUrl}/${survey.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('patch', url);
  });

  it('should return 403 when missing survey-specific permission', async () => {
    await suite.util.setPermission('surveys|edit');

    await suite.sharedTests.assertMissingAuthorization('patch', url);
  });

  it(`should return 403 when missing survey-specific permission`, async () => {
    await suite.util.setPermission('surveys|overrides');

    await suite.sharedTests.assertMissingAuthorization('patch', url);
  });

  it(`should return 403 when missing 'surveys-edit' or 'surveys-override' (surveyStaff)`, async () => {
    await suite.util.setPermission(surveyStaff(survey.id));

    await suite.sharedTests.assertMissingAuthorization('patch', url);
  });

  it(`should return 403 when missing 'surveys-edit' or 'surveys-override' (surveyadmin)`, async () => {
    await suite.util.setPermission('surveyadmin');

    await suite.sharedTests.assertMissingAuthorization('patch', url);
  });

  describe('with correct permissions (surveyStaff)', () => {
    beforeAll(async () => {
      await suite.util.setPermission(['surveys|edit', surveyStaff(survey.id)]);
    });

    it('should return 200 when no input provided (fields are optional for patch)', async () => {
      const { status, body } = await request(suite.app)
        .patch(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(200);
      expect(pick(body, Object.keys(input))).toEqual(input);
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
        overrides: {
          meals: ['shouldBeProperlyFormatMealList'],
          questions: { value: 'not a valid overrides object' },
        },
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
        'overrides',
      ];

      await suite.sharedTests.assertInvalidInput('patch', url, fields, { input: invalidInput });
    });

    it(`should return 403 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .patch(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(403);
    });

    it('should return 200 and data', async () => {
      await suite.sharedTests.assertRecordUpdated('patch', url, output, { input: updateInput });
    });
  });
};
