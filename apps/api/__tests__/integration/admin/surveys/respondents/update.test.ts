import request from 'supertest';
import {
  CreateRespondentRequest,
  UpdateRespondentRequest,
} from '@intake24/common/types/http/admin';
import { mocker, suite, SetSecurableOptions } from '@intake24/api-tests/integration/helpers';
import { Survey, UserSurveyAlias } from '@intake24/db';
import { omit, pick } from 'lodash';
import ioc from '@intake24/api/ioc';
import { CustomField } from '@intake24/common/types';

const assertRespondentResponse = async (
  url: string,
  input: UpdateRespondentRequest
  // output: Omit<CreateRespondentRequest, 'password' | 'passwordConfirm'>
) => {
  const { status, body } = await request(suite.app)
    .patch(url)
    .set('Accept', 'application/json')
    .set('Authorization', suite.bearer.user)
    .send(input);

  expect(status).toBe(200);

  // Extract custom fields, permissions, roles for non-order specific comparison
  const { customFields: resCustomFields, ...data } = body;

  const { customFields: outputCustomFields, password, passwordConfirm, ...restUpdateInput } = input;

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
};

export default () => {
  const baseUrl = '/api/admin/surveys';
  const permissions = ['surveys', 'surveys|respondents'];

  let url: string;
  let invalidSurveyUrl: string;
  let invalidRespondentUrl: string;

  let survey: Survey;

  let input: CreateRespondentRequest;
  let updateInput: UpdateRespondentRequest;
  let respondent: UserSurveyAlias;

  let securable: SetSecurableOptions;

  beforeAll(async () => {
    const surveyInput = mocker.system.survey();
    survey = await Survey.create({
      ...surveyInput,
      startDate: new Date(surveyInput.startDate),
      endDate: new Date(surveyInput.endDate),
    });

    securable = { securableId: survey.id, securableType: 'Survey' };

    input = mocker.system.respondent();

    const updateRespondent = omit(mocker.system.respondent(), ['username']);
    updateInput = {
      ...updateRespondent,
      email: updateRespondent.email?.toLocaleLowerCase(),
    };

    respondent = await ioc.cradle.adminSurveyService.createRespondent(survey.id, input);

    url = `${baseUrl}/${survey.id}/respondents/${respondent.userId}`;
    invalidSurveyUrl = `${baseUrl}/999999/respondents/${respondent.userId}`;
    invalidRespondentUrl = `${baseUrl}/${survey.id}/respondents/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('patch', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when survey record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('patch', invalidSurveyUrl);
    });

    it(`should return 404 when user record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('patch', invalidRespondentUrl);
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
      await assertRespondentResponse(url, updateInput);
    });
  });

  describe('authenticated / securables authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(['surveys']);
    });

    it('should return 204 and no content when securable set', async () => {
      await suite.util.setSecurable({ ...securable, action: ['respondents'] });

      const updateRespondent2 = omit(mocker.system.respondent(), ['username']);
      const updateInput2 = {
        ...updateRespondent2,
        email: updateRespondent2.email?.toLocaleLowerCase(),
      };

      await assertRespondentResponse(url, updateInput2);
    });

    it('should return 204 and no content when owner set', async () => {
      await suite.util.setSecurable(securable);
      await survey.update({ ownerId: suite.data.system.user.id });

      const updateRespondent3 = omit(mocker.system.respondent(), ['username']);
      const updateInput3 = {
        ...updateRespondent3,
        email: updateRespondent3.email?.toLocaleLowerCase(),
      };

      await assertRespondentResponse(url, updateInput3);
    });
  });
};
