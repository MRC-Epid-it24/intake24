import request from 'supertest';
import { JobEntry } from '@common/types/http/admin';
import { suite, setPermission } from '@tests/integration/helpers';

export default (): void => {
  const baseUrl = '/api/admin/jobs';

  let url: string;
  let invalidUrl: string;

  let input: { startDate: string; endDate: string };
  let job: JobEntry;

  beforeAll(async () => {
    const { startDate, endDate } = suite.data.survey;
    input = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };

    await setPermission(['surveys-data-export', 'surveyadmin']);

    const {
      body: { data },
    } = await request(suite.app)
      .post(`/api/admin/surveys/${suite.data.survey.id}/data-export`)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.superuser)
      .send(input);

    job = data;

    await setPermission([]);

    url = `${baseUrl}/${job.id}/download`;
    invalidUrl = `${baseUrl}/999999/download`;

    // wait until the job is finished
    let waiting = true;

    const sleep = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    while (waiting) {
      const res = await request(suite.app)
        .get(`${baseUrl}/${job.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.superuser);

      if (res.body.data.downloadUrl !== null) {
        job = res.body.data;
        waiting = false;
      } else sleep(1000);
    }
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
      await setPermission('jobs-read');
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .get(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(404);
    });

    it('should return 200 and data resource', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Buffer);
    });
  });
};
