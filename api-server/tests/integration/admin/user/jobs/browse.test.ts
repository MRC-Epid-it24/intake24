import request from 'supertest';
import { Job } from '@/db/models/system';
import { suite, setPermission } from '@tests/integration/helpers';

export default (): void => {
  const url = '/api/admin/user/jobs';
  let input: { startDate: string; endDate: string };

  beforeAll(async () => {
    const { startDate, endDate } = suite.data.survey;
    input = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 200 and data list', async () => {
    // Admin user job
    await request(suite.app)
      .post(`/api/admin/surveys/${suite.data.survey.id}/data-export`)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.superuser)
      .send(input);

    // Test user job
    await setPermission(['surveys-data-export', 'surveyadmin']);
    await request(suite.app)
      .post(`/api/admin/surveys/${suite.data.survey.id}/data-export`)
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
    const match = body.data.find((item: Job) => item.userId !== suite.data.user.id);
    expect(match).toBeUndefined();
  });
};
