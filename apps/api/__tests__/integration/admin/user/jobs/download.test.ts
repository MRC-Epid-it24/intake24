import request from 'supertest';

import { sleep } from '@intake24/api/util';
import { suite } from '@intake24/api-tests/integration/helpers';
import type { JobAttributes } from '@intake24/common/types/http/admin';

export default () => {
  const baseUrl = '/api/admin/user/jobs';

  let url: string;
  let invalidUrl: string;

  let job: JobAttributes;

  beforeAll(async () => {
    const { id, startDate, endDate } = suite.data.system.survey;
    const input = {
      type: 'SurveyDataExport',
      params: {
        surveyId: id,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      },
    };

    await suite.util.setPermission(['surveys', 'surveys:tasks']);

    const { body } = await request(suite.app)
      .post(`/api/admin/surveys/${suite.data.system.survey.id}/tasks`)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user)
      .send(input);

    job = body;

    await suite.util.setPermission([]);

    url = `${baseUrl}/${job.id}/download`;
    invalidUrl = `${baseUrl}/999999/download`;

    // wait until the job is finished
    let waiting = true;

    while (waiting) {
      const res = await request(suite.app)
        .get(`${baseUrl}/${job.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      if (res.body.downloadUrl !== null) {
        job = res.body;
        waiting = false;
      }
      else {
        sleep(1000);
      }
    }
  });

  it('missing authentication / authorization', async () => {
    await suite.sharedTests.assertMissingAuthentication('get', url);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    await suite.sharedTests.assertMissingRecord('get', invalidUrl);
  });

  it('should return 200 and data resource', async () => {
    await suite.sharedTests.assertInstanceOf('get', url, Object);
  });
};
