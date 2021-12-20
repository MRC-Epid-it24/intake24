import request from 'supertest';
import { CreateRespondentRequest } from '@common/types/http/admin';
import { mocker, suite, setPermission } from '@tests/integration/helpers';
import { Survey } from '@api/db/models/system';
import { surveyStaff } from '@api/services/core/auth';
import { pick } from 'lodash';
import { CustomField } from '@common/types';

export default (): void => {
  const baseUrl = '/api/admin/surveys';

  let url: string;
  let invalidSurveyUrl: string;

  let survey: Survey;

  let input: CreateRespondentRequest;
  let output: Omit<CreateRespondentRequest, 'password' | 'passwordConfirm'>;

  beforeAll(async () => {
    const surveyInput = mocker.system.survey();
    survey = await Survey.create({
      ...surveyInput,
      startDate: new Date(surveyInput.startDate),
      endDate: new Date(surveyInput.endDate),
    });

    url = `${baseUrl}/${survey.id}/respondents`;
    invalidSurveyUrl = `${baseUrl}/invalid-survey-id/respondents`;

    input = mocker.system.respondent();
    const { email, password, passwordConfirm, ...rest } = input;
    output = {
      ...rest,
      email: email ? email.toLowerCase() : undefined,
    };
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).post(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing survey-specific permission', async () => {
    await setPermission('surveys-respondents');

    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-respondents' permission (surveyadmin)`, async () => {
    await setPermission('surveyadmin');

    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-respondents' permission (surveyStaff)`, async () => {
    await setPermission(surveyStaff(survey.id));

    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when record doesn't exist -> no survey permission created yet`, async () => {
    await setPermission(['surveys-respondents', surveyStaff(survey.id)]);

    const { status } = await request(suite.app)
      .post(invalidSurveyUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    await setPermission(['surveys-respondents', 'surveyadmin']);

    const { status } = await request(suite.app)
      .post(invalidSurveyUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user)
      .send(input);

    expect(status).toBe(404);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission(['surveys-respondents', surveyStaff(survey.id)]);
    });

    it('should return 422 for missing input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['userName', 'password', 'passwordConfirm']);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          userName: 'test-respondent@example.com',
          password: 'notacomplexpassword',
          passwordConfirm: 'notMatchingPassword',
          name: ['test respondent'],
          email: false,
          phone: [new Date()],
          customFields: 'not-a-custom-field',
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys([
        'userName',
        'password',
        'passwordConfirm',
        'name',
        'email',
        'phone',
        'customFields',
      ]);
    });

    it('should return 201 and new resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(status).toBe(201);

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
