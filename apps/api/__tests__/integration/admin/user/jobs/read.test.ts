import request from 'supertest';

import type { JobEntry } from '@intake24/common/types/http/admin';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const baseUrl = '/api/admin/user/jobs';

  let url: string;
  let invalidUrl: string;

  let input: { startDate: string; endDate: string };
  let job: JobEntry;

  beforeAll(async () => {
    const { startDate, endDate } = suite.data.system.survey;
    input = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };

    await suite.util.setPermission(['surveys', 'surveys|data-export']);

    const { body } = await request(suite.app)
      .post(`/api/admin/surveys/${suite.data.system.survey.id}/data-export`)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user)
      .send(input);

    await suite.util.setPermission([]);

    job = body;

    url = `${baseUrl}/${job.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assertMissingAuthentication('get', url);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    await suite.sharedTests.assertMissingRecord('get', invalidUrl);
  });

  it('should return 200 and data resource', async () => {
    await suite.sharedTests.assertRecord('get', url, job);
  });
};