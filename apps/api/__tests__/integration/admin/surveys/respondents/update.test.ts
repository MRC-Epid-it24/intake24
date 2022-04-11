import request from 'supertest';
import {
  CreateRespondentRequest,
  UpdateRespondentRequest,
} from '@intake24/common/types/http/admin';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { Survey, UserSurveyAlias } from '@intake24/db';
import { surveyStaff } from '@intake24/common/security';
import { omit, pick } from 'lodash';
import ioc from '@intake24/api/ioc';
import { CustomField } from '@intake24/common/types';

export default () => {
  const baseUrl = '/api/admin/surveys';

  let url: string;
  let invalidSurveyUrl: string;
  let invalidRespondentUrl: string;

  let survey: Survey;

  let input: CreateRespondentRequest;
  let updateInput: UpdateRespondentRequest;
  let respondent: UserSurveyAlias;

  beforeAll(async () => {
    const surveyInput = mocker.system.survey();
    survey = await Survey.create({
      ...surveyInput,
      startDate: new Date(surveyInput.startDate),
      endDate: new Date(surveyInput.endDate),
    });

    input = mocker.system.respondent();
    const updateRespondent = omit(mocker.system.respondent(), ['userName']);
    updateInput = {
      ...updateRespondent,
      email: updateRespondent.email?.toLocaleLowerCase(),
    };

    respondent = await ioc.cradle.adminSurveyService.createRespondent(survey.id, input);

    url = `${baseUrl}/${survey.id}/respondents/${respondent.userId}`;
    invalidSurveyUrl = `${baseUrl}/invalid-survey-id/respondents/${respondent.userId}`;
    invalidRespondentUrl = `${baseUrl}/${survey.id}/respondents/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('patch', url);
  });

  it('should return 403 when missing survey-specific permission', async () => {
    await suite.util.setPermission('surveys|respondents');

    await suite.sharedTests.assertMissingAuthorization('patch', url);
  });

  it(`should return 403 when missing 'surveys-respondents' permission (surveyadmin)`, async () => {
    await suite.util.setPermission('surveyadmin');

    await suite.sharedTests.assertMissingAuthorization('patch', url);
  });

  it(`should return 403 when missing 'surveys-respondents' permission (surveyStaff)`, async () => {
    await suite.util.setPermission(surveyStaff(survey.id));

    await suite.sharedTests.assertMissingAuthorization('patch', url);
  });

  it(`should return 403 when record doesn't exist -> no survey permission created yet`, async () => {
    await suite.util.setPermission(['surveys|respondents', surveyStaff(survey.id)]);

    await suite.sharedTests.assertMissingAuthorization('patch', invalidSurveyUrl);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    await suite.util.setPermission(['surveys|respondents', 'surveyadmin']);

    await suite.sharedTests.assertMissingRecord('patch', invalidSurveyUrl);
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(['surveys|respondents', surveyStaff(survey.id)]);
    });

    it('should return 422 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput(
        'patch',
        url,
        ['password', 'passwordConfirm', 'name', 'email', 'phone', 'customFields'],
        {
          input: {
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

    it(`should return 404 when user record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('patch', invalidRespondentUrl, {
        input: updateInput,
      });
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .patch(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(200);

      // Extract custom fields, permissions, roles for non-order specific comparison
      const { customFields: resCustomFields, ...data } = body;

      const {
        customFields: outputCustomFields,
        password,
        passwordConfirm,
        ...restUpdateInput
      } = updateInput;

      // 1) match the output
      expect(pick(data, Object.keys(restUpdateInput))).toEqual(restUpdateInput);

      // 2) non-order specific comparison
      if (outputCustomFields) {
        const fields = resCustomFields.map(({ name, value }: CustomField) => ({
          name,
          value,
        }));
        expect(fields).toIncludeSameMembers(outputCustomFields);
      }
    });
  });
};
