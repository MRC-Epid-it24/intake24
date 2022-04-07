import request from 'supertest';
import { CreateRespondentRequest } from '@intake24/common/types/http/admin';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { Survey } from '@intake24/db';
import { surveyStaff } from '@intake24/common/acl';
import { pick } from 'lodash';
import { CustomField } from '@intake24/common/types';

export default () => {
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

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url);
  });

  it('should return 403 when missing survey-specific permission', async () => {
    await suite.util.setPermission('surveys|respondents');

    await suite.sharedTests.assertMissingAuthorization('post', url);
  });

  it(`should return 403 when missing 'surveys-respondents' permission (surveyadmin)`, async () => {
    await suite.util.setPermission('surveyadmin');

    await suite.sharedTests.assertMissingAuthorization('post', url);
  });

  it(`should return 403 when missing 'surveys-respondents' permission (surveyStaff)`, async () => {
    await suite.util.setPermission(surveyStaff(survey.id));

    await suite.sharedTests.assertMissingAuthorization('post', url);
  });

  it(`should return 403 when record doesn't exist -> no survey permission created yet`, async () => {
    await suite.util.setPermission(['surveys|respondents', surveyStaff(survey.id)]);

    await suite.sharedTests.assertMissingAuthorization('post', invalidSurveyUrl);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    await suite.util.setPermission(['surveys|respondents', 'surveyadmin']);

    await suite.sharedTests.assertMissingRecord('post', invalidSurveyUrl, { input });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(['surveys|respondents', surveyStaff(survey.id)]);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, [
        'userName',
        'password',
        'passwordConfirm',
      ]);
    });

    it('should return 422 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput(
        'post',
        url,
        ['userName', 'password', 'passwordConfirm', 'name', 'email', 'phone', 'customFields'],
        {
          input: {
            userName: 'test-respondent@example.com',
            password: 'notacomplexpassword',
            passwordConfirm: 'notMatchingPassword',
            name: ['test respondent'],
            email: false,
            phone: [new Date()],
            customFields: 'not-a-custom-field',
          },
        }
      );
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

    it('should return 422 for duplicate username', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['userName'], {
        input: { ...mocker.system.respondent(), userName: input.userName },
      });
    });
  });
};
