import { CreateSurveyRequest, SurveyRequest } from '@intake24/common/types/http/admin';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { Survey } from '@intake24/db';
import { surveyStaff } from '@intake24/common/acl';

const refreshSurveyRecord = async (input: CreateSurveyRequest): Promise<Survey> => {
  const { id } = input;
  const [survey] = await Survey.findOrCreate({
    where: { id },
    defaults: {
      ...input,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
    },
  });

  return survey;
};

export default () => {
  const baseUrl = '/api/admin/surveys';

  let url: string;
  let invalidUrl: string;

  let input: SurveyRequest;
  let survey: Survey;

  beforeAll(async () => {
    input = mocker.system.survey();
    survey = await refreshSurveyRecord(input);

    url = `${baseUrl}/${survey.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('delete', url);
  });

  it('should return 403 when missing survey-specific permission', async () => {
    await suite.util.setPermission('surveys|delete');

    await suite.sharedTests.assertMissingAuthorization('delete', url);
  });

  it(`should return 403 when missing 'surveys-delete' permission (surveyadmin)`, async () => {
    await suite.util.setPermission('surveyadmin');

    await suite.sharedTests.assertMissingAuthorization('delete', url);
  });

  it(`should return 403 when missing 'surveys-delete' permission (surveyStaff)`, async () => {
    await suite.util.setPermission(surveyStaff(survey.id));

    await suite.sharedTests.assertMissingAuthorization('delete', url);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    await suite.util.setPermission(['surveys|delete', 'surveyadmin']);

    await suite.sharedTests.assertMissingRecord('delete', invalidUrl);
  });

  it('should return 204 and no content (surveyadmin)', async () => {
    survey = await refreshSurveyRecord(input);
    await suite.util.setPermission(['surveys|delete', 'surveyadmin']);

    await suite.sharedTests.assertRecordDeleted('delete', url);
  });

  it('should return 204 and no content (surveyStaff)', async () => {
    survey = await refreshSurveyRecord(input);
    await suite.util.setPermission(['surveys|delete', surveyStaff(survey.id)]);

    await suite.sharedTests.assertRecordDeleted('delete', url);
  });
};
