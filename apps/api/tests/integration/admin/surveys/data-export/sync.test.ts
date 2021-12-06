import request from 'supertest';
import { suite, setPermission } from '@tests/integration/helpers';
import { surveyStaff } from '@api/services/core/auth';

export default (): void => {
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

    url = `${baseUrl}/${id}/data-export/sync`;
    invalidUrl = `${baseUrl}/999999/data-export/sync`;
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).post(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it('should return 403 when missing survey-specific permission', async () => {
    await setPermission('surveys-data-export');

    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-data-export' permission (surveyadmin)`, async () => {
    await setPermission('surveyadmin');

    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-data-export' permission (surveyStaff)`, async () => {
    await setPermission(surveyStaff(suite.data.system.survey.id));

    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when record doesn't exist -> no survey permission created yet`, async () => {
    await setPermission(['surveys-mgmt', surveyStaff(suite.data.system.survey.id)]);

    const { status } = await request(suite.app)
      .post(invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission(['surveys-data-export', 'surveyadmin']);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .post(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(status).toBe(404);
    });

    it('should return 422 for missing input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['startDate', 'endDate']);
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
      expect(body).toBeInstanceOf(Buffer);
    });
  });
};
