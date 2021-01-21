import { expect } from 'chai';
import request from 'supertest';
import { surveyStaff } from '@/services/acl.service';
import { setPermission } from '../../../mocks/helpers';

export default function (): void {
  before(async function () {
    const { id, startDate, endDate } = this.data.survey;
    this.input = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };

    const baseUrl = '/api/admin/surveys';
    this.url = `${baseUrl}/${id}/data-export/sync`;
    this.invalidUrl = `${baseUrl}/999999/data-export/sync`;
  });

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).post(this.url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it('should return 403 when missing survey-specific permission', async function () {
    await setPermission('surveys-data-export');

    const { status } = await request(this.app)
      .put(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  it(`should return 403 when missing 'surveys-data-export' permission (surveyadmin)`, async function () {
    await setPermission('surveyadmin');

    const { status } = await request(this.app)
      .put(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  it(`should return 403 when missing 'surveys-data-export' permission (surveyStaff)`, async function () {
    await setPermission(surveyStaff(this.data.survey.id));

    const { status } = await request(this.app)
      .put(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  describe('with correct permissions', function () {
    before(async function () {
      await setPermission(['surveys-data-export', 'surveyadmin']);
    });

    it(`should return 404 when record doesn't exist`, async function () {
      const { status } = await request(this.app)
        .post(this.invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer)
        .send(this.input);

      expect(status).to.equal(404);
    });

    it('should return 422 when missing input data', async function () {
      const { status, body } = await request(this.app)
        .post(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer);

      expect(status).to.equal(422);
      expect(body).to.be.an('object').to.have.keys('errors', 'success');
      expect(body.errors).to.have.keys('startDate', 'endDate');
    });

    it('should return 422 when invalid input data', async function () {
      const { status, body } = await request(this.app)
        .post(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer)
        .send({
          startDate: 'notValidDate',
          endDate: 100,
        });

      expect(status).to.equal(422);
      expect(body).to.be.an('object').to.have.keys('errors', 'success');
      expect(body.errors).to.have.keys('startDate', 'endDate');
    });

    it('should return 200 and job resource', async function () {
      const { status, body } = await request(this.app)
        .post(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer)
        .send(this.input);

      expect(status).to.equal(200);
      expect(body).to.be.instanceof(Buffer);
    });
  });
}
