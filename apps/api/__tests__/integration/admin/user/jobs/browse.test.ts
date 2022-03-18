import request from 'supertest';
import { suite, setPermission } from '@intake24/api-tests/integration/helpers';
import { Job } from '@intake24/db';

export default () => {
  const url = '/api/admin/user/jobs';
  let input: { startDate: string; endDate: string };

  beforeAll(async () => {
    const { startDate, endDate } = suite.data.system.survey;
    input = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  });

  test('missing authentication', async () => {
    await suite.sharedTests.assertMissingAuthentication('get', url);
  });

  it('should return 200 and data list', async () => {
    // Admin user job
    await request(suite.app)
      .post(`/api/admin/surveys/${suite.data.system.survey.id}/data-export`)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.superuser)
      .send(input);

    // Test user job
    await setPermission(['surveys|data-export', 'surveyadmin']);
    await request(suite.app)
      .post(`/api/admin/surveys/${suite.data.system.survey.id}/data-export`)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user)
      .send(input);

    await setPermission([]);

    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(200);
    expect(body).toContainAllKeys(['data', 'meta']);
    expect(body.data).toBeArray();
    expect(body.data).not.toBeEmpty();

    // Expect to only find test user's jobs
    const match = body.data.find((item: Job) => item.userId !== suite.data.system.user.id);
    expect(match).toBeUndefined();
  });
};
