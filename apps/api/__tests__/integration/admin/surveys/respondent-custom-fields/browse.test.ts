import type { SetSecurableOptions } from '@intake24/api-tests/integration/helpers';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import ioc from '@intake24/api/ioc';
import { Survey, UserSurveyAlias } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/surveys';
  const permissions = ['surveys', 'surveys:respondents'];

  let url: string;
  let invalidUrl: string;

  let survey: Survey;
  let respondent: UserSurveyAlias;

  let securable: SetSecurableOptions;

  beforeAll(async () => {
    const surveyInput = mocker.system.survey();
    survey = await Survey.create({
      ...surveyInput,
      userCustomFields: true,
    });

    securable = { securableId: survey.id, securableType: 'Survey' };

    respondent = await ioc.cradle.adminSurveyService.createRespondent(survey.id, mocker.system.respondent());

    url = `${baseUrl}/${survey.id}/respondents/${respondent.username}/custom-fields`;
    invalidUrl = `${baseUrl}/${survey.id}/respondents/invalid-username/custom-fields`;
  });

  it('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('get', invalidUrl);
    });

    it('should return 200 and paginated results', async () => {
      await suite.sharedTests.assertPaginatedResult('get', url, { result: true });
    });
  });

  describe('authenticated / securables authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(['surveys']);
    });

    it('should return 200 and data when securable set', async () => {
      await suite.util.setSecurable({ ...securable, action: ['respondents'] });

      await suite.sharedTests.assertPaginatedResult('get', url, { result: true });
    });

    it('should return 200 and data when owner set', async () => {
      await suite.util.setSecurable(securable);
      await survey.update({ ownerId: suite.data.system.user.id });

      await suite.sharedTests.assertPaginatedResult('get', url, { result: true });
    });
  });
};
