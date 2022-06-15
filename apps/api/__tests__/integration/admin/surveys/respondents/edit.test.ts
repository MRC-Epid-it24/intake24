import request from 'supertest';
import type { CreateRespondentRequest } from '@intake24/common/types/http/admin';
import { mocker, suite, SetSecurableOptions } from '@intake24/api-tests/integration/helpers';
import { Survey, UserSurveyAlias } from '@intake24/db';
import { omit, pick } from 'lodash';
import ioc from '@intake24/api/ioc';
import type { CustomField } from '@intake24/common/types';

const assertRespondentResponse = async (
  url: string,
  output: Omit<CreateRespondentRequest, 'password' | 'passwordConfirm'>
) => {
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
};

export default () => {
  const baseUrl = '/api/admin/surveys';
  const permissions = ['surveys', 'surveys|respondents'];

  let url: string;
  let invalidSurveyUrl: string;
  let invalidRespondentUrl: string;

  let survey: Survey;
  let respondent: UserSurveyAlias;

  let input: CreateRespondentRequest;
  let output: Omit<CreateRespondentRequest, 'password' | 'passwordConfirm'>;

  let securable: SetSecurableOptions;

  beforeAll(async () => {
    const surveyInput = mocker.system.survey();
    survey = await Survey.create({
      ...surveyInput,
      startDate: new Date(surveyInput.startDate),
      endDate: new Date(surveyInput.endDate),
      userCustomFields: true,
      userPersonalIdentifiers: true,
    });

    securable = { securableId: survey.id, securableType: 'Survey' };

    input = mocker.system.respondent();
    output = omit(input, ['password', 'passwordConfirm']);

    respondent = await ioc.cradle.adminSurveyService.createRespondent(survey.id, input);

    url = `${baseUrl}/${survey.id}/respondents/${respondent.userId}/edit`;
    invalidSurveyUrl = `${baseUrl}/999999/respondents/${respondent.userId}/edit`;
    invalidRespondentUrl = `${baseUrl}/${survey.id}/respondents/999999/edit`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when survey record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('get', invalidSurveyUrl);
    });

    it(`should return 404 when user record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('get', invalidRespondentUrl);
    });

    it('should return 200 and data', async () => {
      await assertRespondentResponse(url, output);
    });
  });

  describe('authenticated / securables authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(['surveys']);
    });

    it('should return 200 and data when securable set', async () => {
      await suite.util.setSecurable({ ...securable, action: ['respondents'] });

      await assertRespondentResponse(url, output);
    });

    it('should return 200 and data when owner set', async () => {
      await suite.util.setSecurable(securable);
      await survey.update({ ownerId: suite.data.system.user.id });

      await assertRespondentResponse(url, output);
    });
  });
};
