import { pick } from 'lodash';
import request from 'supertest';
import { JobEntry } from '@intake24/common/types/http/admin';
import { suite, setPermission } from '@intake24/api-tests/integration/helpers';

export default (): void => {
  const baseUrl = '/api/admin/jobs';

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

    const { body } = await request(suite.app)
      .post(`/api/admin/surveys/${suite.data.system.survey.id}/data-export`)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.superuser)
      .send(input);

    job = body;

    url = `${baseUrl}/${job.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission('jobs|read');
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .get(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(404);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(200);
      expect(pick(body, Object.keys(job))).toEqual(job);
    });
  });
};
