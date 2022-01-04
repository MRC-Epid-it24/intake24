import request from 'supertest';
import { CreateRespondentRequest } from '@common/types/http/admin';
import { mocker, suite, setPermission } from '@tests/integration/helpers';
import { Survey, UserSurveyAlias } from '@intake24/db';
import { surveyStaff } from '@api/services/core/auth';
import { omit, pick } from 'lodash';
import ioc from '@api/ioc';
import { CustomField } from '@common/types';

export default (): void => {
  const baseUrl = '/api/admin/surveys';

  let url: string;
  let invalidSurveyUrl: string;
  let invalidRespondentUrl: string;

  let survey: Survey;
  let respondent: UserSurveyAlias;

  let input: CreateRespondentRequest;
  let output: Omit<CreateRespondentRequest, 'password' | 'passwordConfirm'>;

  beforeAll(async () => {
    const surveyInput = mocker.system.survey();
    survey = await Survey.create({
      ...surveyInput,
      startDate: new Date(surveyInput.startDate),
      endDate: new Date(surveyInput.endDate),
    });

    input = mocker.system.respondent();
    output = omit(input, ['password', 'passwordConfirm']);

    respondent = await ioc.cradle.adminSurveyService.createRespondent(survey.id, input);

    url = `${baseUrl}/${survey.id}/respondents/${respondent.userId}/edit`;
    invalidSurveyUrl = `${baseUrl}/invalid-survey-id/respondents/${respondent.userId}/edit`;
    invalidRespondentUrl = `${baseUrl}/${survey.id}/respondents/999999/edit`;
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing survey-specific permission', async () => {
    await setPermission('surveys-respondents');

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-respondents' permission (surveyadmin)`, async () => {
    await setPermission('surveyadmin');

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-respondents' permission (surveyStaff)`, async () => {
    await setPermission(surveyStaff(survey.id));

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when record doesn't exist -> no survey permission created yet`, async () => {
    await setPermission(['surveys-respondents', surveyStaff(survey.id)]);

    const { status } = await request(suite.app)
      .get(invalidSurveyUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    await setPermission(['surveys-respondents', 'surveyadmin']);

    const { status } = await request(suite.app)
      .get(invalidSurveyUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(404);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission(['surveys-respondents', surveyStaff(survey.id)]);
    });

    it(`should return 404 when user record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .get(invalidRespondentUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(404);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(200);

      // Extract custom fields for non-order specific comparison
      const { customFields: resCustomFields, ...data } = body;
      const { customFields: outputCustomFields, ...restOutput } = output;

      // 1) match the output
      expect(pick(data, Object.keys(restOutput))).toEqual(restOutput);

      // 2) non-order specific custom field comparison
      if (outputCustomFields) {
        const fields: CustomField[] = resCustomFields.map(({ name, value }: CustomField) => ({
          name,
          value,
        }));
        expect(fields).toIncludeSameMembers(outputCustomFields);
      }
    });
  });
};
