import fs from 'fs-extra';
import request from 'supertest';
import { suite } from '@intake24/api-tests/integration/helpers';
import { surveyStaff } from '@intake24/common/security';

export default () => {
  const baseUrl = '/api/admin/surveys';

  let url: string;
  let invalidUrl: string;

  const fileName = 'uploadRespondents.csv';
  let filePath: string;

  beforeAll(async () => {
    const { id } = suite.data.system.survey;
    filePath = suite.files.data.csv;

    url = `${baseUrl}/${id}/respondents/upload`;
    invalidUrl = `${baseUrl}/invalid-survey-id/respondents/upload`;
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
    await suite.util.setPermission(surveyStaff(suite.data.system.survey.id));

    await suite.sharedTests.assertMissingAuthorization('post', url);
  });

  it(`should return 403 when record doesn't exist -> no survey permission created yet`, async () => {
    await suite.util.setPermission([
      'surveys|respondents',
      surveyStaff(suite.data.system.survey.id),
    ]);

    await suite.sharedTests.assertMissingAuthorization('post', invalidUrl);
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission([
        'surveys|respondents',
        surveyStaff(suite.data.system.survey.id),
      ]);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['file']);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .field('file', '../../asServedSet_001');

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['file']);
    });

    it('should return 200 and job resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .attach('file', fs.createReadStream(filePath), fileName);

      expect(status).toBe(200);
      expect(body).not.toBeEmpty();
    });
  });
};
