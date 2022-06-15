import type { CreateSurveyRequest, SurveyRequest } from '@intake24/common/types/http/admin';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { Survey } from '@intake24/db';

const refreshSurveyRecord = async (input?: CreateSurveyRequest): Promise<Survey> => {
  const mock = input ?? mocker.system.survey();
  return Survey.create({
    ...mock,
    startDate: new Date(mock.startDate),
    endDate: new Date(mock.endDate),
  });
};

export default () => {
  const baseUrl = '/api/admin/surveys';
  const permissions = ['surveys', 'surveys|delete'];

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
    await suite.sharedTests.assert401and403('delete', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('delete', invalidUrl);
    });

    it('should return 204 and no content', async () => {
      await suite.sharedTests.assertRecordDeleted('delete', url);
    });
  });

  describe('authenticated / securables authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(['surveys']);
    });

    it('should return 200 and data when securable set', async () => {
      const { id } = await refreshSurveyRecord();
      await suite.util.setSecurable({
        securableId: id,
        securableType: 'Survey',
        action: ['delete'],
      });

      await suite.sharedTests.assertRecordDeleted('delete', `${baseUrl}/${id}`);
    });

    it('should return 200 and data when owner set', async () => {
      const { id } = await refreshSurveyRecord({
        ...mocker.system.survey(),
        ownerId: suite.data.system.user.id,
      });

      await suite.sharedTests.assertRecordDeleted('delete', `${baseUrl}/${id}`);
    });
  });
};
