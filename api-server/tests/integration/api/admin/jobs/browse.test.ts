import { expect } from 'chai';
import request from 'supertest';
import { Job } from '@/db/models/system';
import { setPermission } from '../../mocks/helpers';

export default function (): void {
  before(async function () {
    this.url = '/api/admin/jobs';

    const { startDate, endDate } = this.data.survey;
    this.input = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  });

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).get(this.url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it('should return 200 and data list', async function () {
    // Admin user job
    await request(this.app)
      .post(`/api/admin/surveys/${this.data.survey.id}/data-export`)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.admin)
      .send(this.input);

    // Test user job
    await setPermission(['surveys-data-export', 'surveyadmin']);
    await request(this.app)
      .post(`/api/admin/surveys/${this.data.survey.id}/data-export`)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.user)
      .send(this.input);

    await setPermission([]);

    const { status, body } = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.user);

    expect(status).to.equal(200);
    expect(body).to.be.an('object').to.have.keys('data', 'meta');
    expect(body.data).to.be.an('array').not.to.be.empty;

    // Expect to only find test user's jobs
    const match = body.data.find((item: Job) => item.userId !== this.data.user.id);
    expect(match).to.be.undefined;
  });
}
