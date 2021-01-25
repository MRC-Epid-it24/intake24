import { expect } from 'chai';
import request from 'supertest';
import { setPermission } from '../../mocks/helpers';

export default function (): void {
  before(async function () {
    const { startDate, endDate } = this.data.survey;
    this.input = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };

    await setPermission(['surveys-data-export', 'surveyadmin']);

    const {
      body: { data },
    } = await request(this.app)
      .post(`/api/admin/surveys/${this.data.survey.id}/data-export`)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.user)
      .send(this.input);

    this.job = data;

    await setPermission([]);

    const baseUrl = '/api/admin/jobs';
    this.url = `${baseUrl}/${this.job.id}/download`;
    this.invalidUrl = `${baseUrl}/999999/download`;

    // wait until the job is finished
    let waiting = true;

    const sleep = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    while (waiting) {
      const res = await request(this.app)
        .get(`${baseUrl}/${this.job.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user);

      if (res.body.data.downloadUrl !== null) {
        this.job = res.body.data;
        waiting = false;
      } else sleep(1000);
    }
  });

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).get(this.url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it(`should return 404 when record doesn't exist`, async function () {
    const { status } = await request(this.app)
      .get(this.invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.user);

    expect(status).to.equal(404);
  });

  it('should return 200 and data resource', async function () {
    const { status, body } = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.user);

    expect(status).to.equal(200);
    expect(body).to.be.instanceof(Buffer);
  });
}
