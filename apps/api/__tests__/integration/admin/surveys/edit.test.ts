import { SurveyRequest } from '@intake24/common/types/http/admin';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { Survey } from '@intake24/db';
import { surveyStaff } from '@intake24/common/security';

export default () => {
  const baseUrl = '/api/admin/surveys';

  let url: string;
  let invalidUrl: string;

  let input: SurveyRequest;
  let output: SurveyRequest;
  let survey: Survey;

  beforeAll(async () => {
    input = mocker.system.survey();
    survey = await Survey.create({
      ...input,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
    });
    output = { ...input };

    url = `${baseUrl}/${survey.id}/edit`;
    invalidUrl = `${baseUrl}/999999/edit`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
  });

  it('should return 403 when missing survey-specific permission', async () => {
    await suite.util.setPermission('surveys|edit');

    await suite.sharedTests.assertMissingAuthorization('get', url);
  });

  it(`should return 403 when missing 'surveys-edit' permission (surveyadmin)`, async () => {
    await suite.util.setPermission('surveyadmin');

    await suite.sharedTests.assertMissingAuthorization('get', url);
  });

  it(`should return 403 when missing 'surveys-edit' permission (surveyStaff)`, async () => {
    await suite.util.setPermission(surveyStaff(survey.id));

    await suite.sharedTests.assertMissingAuthorization('get', url);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    await suite.util.setPermission(['surveys|edit', 'surveyadmin']);

    await suite.sharedTests.assertMissingRecord('get', invalidUrl);
  });

  it('should return 200 and data/refs (surveyadmin)', async () => {
    await suite.util.setPermission(['surveys|edit', 'surveyadmin']);

    await suite.sharedTests.assertRecord('get', url, output);
  });

  it('should return 200 and data/refs (surveyStaff)', async () => {
    await suite.util.setPermission(['surveys|edit', surveyStaff(survey.id)]);

    await suite.sharedTests.assertRecord('get', url, output);
  });
};
