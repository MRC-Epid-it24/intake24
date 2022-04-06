import request from 'supertest';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/jobs';
  const permissions = ['jobs', 'jobs|browse'];

  let input: { startDate: string; endDate: string };

  beforeAll(async () => {
    const { startDate, endDate } = suite.data.system.survey;
    input = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };

    await request(suite.app)
      .post(`/api/admin/surveys/${suite.data.system.survey.id}/data-export`)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.superuser)
      .send(input);
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
  });

  it('should return 200 and paginated results', async () => {
    await suite.util.setPermission(permissions);

    await suite.sharedTests.assertPaginatedResult('get', url, { result: true });
  });
};
