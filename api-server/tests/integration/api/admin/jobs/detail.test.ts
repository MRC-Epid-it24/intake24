import { expect } from 'chai';
import { pick } from 'lodash';
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

    await setPermission([]);

    this.job = data;

    const baseUrl = '/api/admin/jobs';
    this.url = `${baseUrl}/${this.job.id}`;
    this.invalidUrl = `${baseUrl}/999999`;
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
    expect(body).to.be.an('object').to.have.keys('data');
    expect(pick(body.data, Object.keys(this.job))).to.deep.equal(this.job);
  });
}
