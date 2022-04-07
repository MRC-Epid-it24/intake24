import request from 'supertest';
import { SurveyRequest } from '@intake24/common/types/http/admin';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { Survey } from '@intake24/db';
import { surveyStaff } from '@intake24/common/acl';

export default () => {
  const baseUrl = '/api/admin/surveys';

  let url: string;
  let invalidUrl: string;

  let input: SurveyRequest;
  let updateInput: SurveyRequest;
  let output: SurveyRequest;
  let survey: Survey;

  beforeAll(async () => {
    input = mocker.system.survey();
    updateInput = mocker.system.survey();

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
    await suite.sharedTests.assert401and403('put', url);
  });

  it('should return 403 when missing survey-specific permission', async () => {
    await suite.util.setPermission('surveys|edit');

    const { status } = await request(suite.app)
      .put(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-edit' permission (surveyadmin)`, async () => {
    await suite.util.setPermission('surveyadmin');

    const { status } = await request(suite.app)
      .put(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing surveyadmin`, async () => {
    await suite.util.setPermission(['surveys|edit', surveyStaff(survey.id)]);

    const { status } = await request(suite.app)
      .put(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(['surveys|edit', 'surveyadmin']);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertMissingInput('put', url, [
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
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
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
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys([
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
      ]);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('put', invalidUrl, { input: updateInput });
    });

    it('should return 200 and data', async () => {
      await suite.sharedTests.assertRecordUpdated('put', url, output, { input: updateInput });
    });
  });
};
