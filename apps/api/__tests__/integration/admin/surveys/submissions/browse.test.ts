import { SurveyRequest } from '@intake24/common/types/http/admin';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { Survey } from '@intake24/db';
import { surveyStaff } from '@intake24/common/security';

export default () => {
  const baseUrl = '/api/admin/surveys';

  let url: string;
  let invalidUrl: string;

  let input: SurveyRequest;
  let survey: Survey;

  beforeAll(async () => {
    input = mocker.system.survey();
    survey = await Survey.create({
      ...input,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
    });

    url = `${baseUrl}/${survey.id}/submissions`;
    invalidUrl = `${baseUrl}/invalid-survey-id/submissions`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
  });

  it('should return 403 when missing survey-specific permission', async () => {
    await suite.util.setPermission('surveys|submissions');

    await suite.sharedTests.assertMissingAuthorization('get', url);
  });

  it(`should return 403 when missing 'surveys-submissions' permission (surveyadmin)`, async () => {
    await suite.util.setPermission('surveyadmin');

    await suite.sharedTests.assertMissingAuthorization('get', url);
  });

  it(`should return 403 when missing 'surveys-submissions' permission (surveyStaff)`, async () => {
    await suite.util.setPermission(surveyStaff(survey.id));

    await suite.sharedTests.assertMissingAuthorization('get', url);
  });

  it(`should return 403 when record doesn't exist -> no survey permission created yet`, async () => {
    await suite.util.setPermission(['surveys|submissions', surveyStaff(survey.id)]);

    await suite.sharedTests.assertMissingAuthorization('get', invalidUrl);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    await suite.util.setPermission(['surveys|submissions', 'surveyadmin']);

    await suite.sharedTests.assertMissingRecord('get', invalidUrl);
  });

  it('should return 200 and paginated results', async () => {
    await suite.util.setPermission(['surveys|submissions', surveyStaff(survey.id)]);

    await suite.sharedTests.assertPaginatedResult('get', url, { result: false });
  });
};
