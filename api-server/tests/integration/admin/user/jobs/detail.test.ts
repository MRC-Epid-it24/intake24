import { pick } from 'lodash';
import request from 'supertest';
import { JobEntry } from '@common/types/http';
import { suite, setPermission } from '../../../helpers';

export default (): void => {
  const baseUrl = '/api/admin/user/jobs';

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
      .set('Authorization', suite.bearer.user)
      .send(input);

    await setPermission([]);

    job = data;

    url = `${baseUrl}/${job.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
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
    expect(body).toContainAllKeys(['data']);
    expect(pick(body.data, Object.keys(job))).toEqual(job);
  });
};
