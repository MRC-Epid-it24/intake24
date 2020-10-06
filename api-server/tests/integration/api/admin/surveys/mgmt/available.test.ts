import { expect } from 'chai';
import request from 'supertest';
import { Survey } from '@/db/models/system';
import { surveyStaff } from '@/services/acl.service';
import { setPermission } from '../../../mocks/helpers';
import * as mocker from '../../../mocks/mocker';

export default function (): void {
  before(async function () {
    this.input = mocker.survey();
    this.survey = await Survey.create(this.input);

    const baseUrl = '/api/admin/surveys';
    this.url = `${baseUrl}/${this.survey.id}/mgmt/available`;
    this.invalidUrl = `${baseUrl}/invalid-survey-id/mgmt/available`;
  });

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).get(this.url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it('should return 403 when missing survey-specific permission', async function () {
    await setPermission('surveys-mgmt');

    const { status } = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  it(`should return 403 when missing 'surveys-mgmt' permission (surveyadmin)`, async function () {
    await setPermission('surveyadmin');

    const { status } = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  it(`should return 403 when missing 'surveys-mgmt' permission (surveyStaff)`, async function () {
    await setPermission(surveyStaff(this.survey.id));

    const { status } = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  it(`should return 403 when record doesn't exist -> no survey permission created yet`, async function () {
    await setPermission(['surveys-mgmt', surveyStaff(this.survey.id)]);

    const { status } = await request(this.app)
      .get(this.invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  it(`should return 404 when record doesn't exist`, async function () {
    await setPermission(['surveys-mgmt', 'surveyadmin']);

    const { status } = await request(this.app)
      .get(this.invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(404);
  });

  it('should return 200 and data/refs list', async function () {
    await setPermission(['surveys-mgmt', surveyStaff(this.survey.id)]);

    const { status, body } = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(200);
    expect(body).to.be.an('object').to.have.keys('data', 'permissions');
    expect(body.data).to.be.an('array');
    expect(body.permissions).to.be.an('array');
  });
}
