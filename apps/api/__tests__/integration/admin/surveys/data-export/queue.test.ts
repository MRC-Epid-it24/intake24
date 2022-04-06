import request from 'supertest';
import { suite } from '@intake24/api-tests/integration/helpers';
import { surveyStaff } from '@intake24/common/acl';

export default () => {
  const baseUrl = '/api/admin/surveys';

  let input: { startDate: string; endDate: string };

  let url: string;
  let invalidUrl: string;

  beforeAll(async () => {
    const { id, startDate, endDate } = suite.data.system.survey;
    input = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };

    url = `${baseUrl}/${id}/data-export`;
    invalidUrl = `${baseUrl}/invalid-survey-id/data-export`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url);
  });

  it('should return 403 when missing survey-specific permission', async () => {
    await suite.util.setPermission('surveys|data-export');

    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-data-export' permission (surveyadmin)`, async () => {
    await suite.util.setPermission('surveyadmin');

    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-data-export' permission (surveyStaff)`, async () => {
    await suite.util.setPermission(surveyStaff(suite.data.system.survey.id));

    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when record doesn't exist -> no survey permission created yet`, async () => {
    await suite.util.setPermission(['surveys|mgmt', surveyStaff(suite.data.system.survey.id)]);

    const { status } = await request(suite.app)
      .post(invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission([
        'surveys|data-export',
        surveyStaff(suite.data.system.survey.id),
      ]);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertMissingInput('post', url, ['startDate', 'endDate']);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          startDate: 'notValidDate',
          endDate: 100,
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['startDate', 'endDate']);
    });

    it('should return 200 and job resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(status).toBe(200);
      expect(body).not.toBeEmpty();
    });
  });
};
