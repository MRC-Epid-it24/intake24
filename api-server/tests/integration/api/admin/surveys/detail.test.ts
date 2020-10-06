import { expect } from 'chai';
import { pick } from 'lodash';
import request from 'supertest';
import { Survey } from '@/db/models/system';
import { surveyStaff } from '@/services/acl.service';
import { setPermission } from '../../mocks/helpers';
import * as mocker from '../../mocks/mocker';

export default function (): void {
  before(async function () {
    this.input = mocker.survey();
    this.survey = await Survey.create(this.input);
    this.output = { ...this.input };

    const baseUrl = '/api/admin/surveys';
    this.url = `${baseUrl}/${this.survey.id}`;
    this.invalidUrl = `${baseUrl}/999999`;
  });

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).get(this.url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it('should return 403 when missing permission', async function () {
    await setPermission([]);

    const { status } = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  it('should return 403 when missing survey-specific permission', async function () {
    await setPermission('surveys-detail');

    const { status } = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  it(`should return 403 when missing 'surveys-detail' permission (surveyadmin)`, async function () {
    await setPermission('surveyadmin');

    const { status } = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  it(`should return 403 when missing 'surveys-detail' permission (surveyStaff)`, async function () {
    await setPermission(surveyStaff(this.survey.id));

    const { status } = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  it(`should return 404 when record doesn't exist`, async function () {
    await setPermission(['surveys-detail', 'surveyadmin']);

    const { status } = await request(this.app)
      .get(this.invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(404);
  });

  it('should return 200 and data/refs (surveyadmin)', async function () {
    await setPermission(['surveys-detail', 'surveyadmin']);

    const { status, body } = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(200);
    expect(body).to.be.an('object').to.have.keys('data', 'refs');
    expect(pick(body.data, Object.keys(this.output))).to.deep.equal(this.output);
  });

  it('should return 200 and data/refs (surveyStaff)', async function () {
    await setPermission(['surveys-detail', surveyStaff(this.survey.id)]);

    const { status, body } = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(200);
    expect(body).to.be.an('object').to.have.keys('data', 'refs');
    expect(pick(body.data, Object.keys(this.output))).to.deep.equal(this.output);
  });
}
