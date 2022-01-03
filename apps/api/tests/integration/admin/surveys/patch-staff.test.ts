import { pick } from 'lodash';
import request from 'supertest';
import { SurveyRequest } from '@common/types/http/admin';
import { mocker, suite, setPermission } from '@tests/integration/helpers';
import { Survey } from '@api/db';
import { surveyStaff } from '@api/services/core/auth';
import { StaffUpdateSurveyFields, staffUpdateSurveyFields } from '@common/types/models';

export default (): void => {
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

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).patch(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .patch(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it('should return 403 when missing survey-specific permission', async () => {
    await setPermission('surveys-edit');

    const { status } = await request(suite.app)
      .patch(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing survey-specific permission`, async () => {
    await setPermission('surveys-overrides');

    const { status } = await request(suite.app)
      .patch(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-edit' or 'surveys-override' (surveyStaff)`, async () => {
    await setPermission(surveyStaff(survey.id));

    const { status } = await request(suite.app)
      .patch(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-edit' or 'surveys-override' (surveyadmin)`, async () => {
    await setPermission('surveyadmin');

    const { status } = await request(suite.app)
      .patch(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions (surveyStaff)', () => {
    beforeAll(async () => {
      await setPermission(['surveys-edit', surveyStaff(survey.id)]);
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
      const { status, body } = await request(suite.app)
        .patch(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          name: { name: 'survey name' },
          state: 10,
          startDate: 'notValidDate',
          endDate: 100,
          schemeId: 'invalidSchemeId',
          localeId: 10,
          supportEmail: 'thisIsNotValidEmail',
          allowGenUsers: 'no',
          feedbackEnabled: 10,
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
        'schemeId',
        'localeId',
        'supportEmail',
        'allowGenUsers',
        'feedbackEnabled',
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

    it(`should return 403 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .patch(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(403);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .patch(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(200);
      expect(pick(body, Object.keys(output))).toEqual(output);
    });
  });
};
