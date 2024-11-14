import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { SurveyScheme } from '@intake24/db';

export default () => {
  const url = '/api/admin/survey-schemes';
  const permissions = ['survey-schemes', 'survey-schemes:browse'];

  let surveyScheme: SurveyScheme;

  beforeAll(async () => {
    const input = mocker.system.surveyScheme();

    surveyScheme = await SurveyScheme.create(input);
  });

  it('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
  });

  describe('authenticated / resource authorized', () => {
    it('should return 200 and paginated results', async () => {
      await suite.util.setPermission(permissions);

      await suite.sharedTests.assertPaginatedResult('get', url, { result: true });
    });

    it('should return 200 and empty paginated results', async () => {
      await suite.util.setPermission('survey-schemes');

      await suite.sharedTests.assertPaginatedResult('get', url, { result: false });
    });

    it('should return 200 and with record access', async () => {
      await suite.util.setSecurable({
        securableId: surveyScheme.id,
        securableType: 'SurveyScheme',
        action: ['edit'],
      });

      await suite.sharedTests.assertPaginatedResult('get', url, { result: surveyScheme.id });
    });
  });
};
