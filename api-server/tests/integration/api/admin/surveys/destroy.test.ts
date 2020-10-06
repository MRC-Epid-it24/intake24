import { expect } from 'chai';
import request from 'supertest';
import { Survey } from '@/db/models/system';
import { surveyStaff } from '@/services/acl.service';
import { CreateSurveyRequest } from '@common/types/http/admin/surveys';
import { setPermission } from '../../mocks/helpers';
import * as mocker from '../../mocks/mocker';

const refreshSurveyRecord = async (input: CreateSurveyRequest): Promise<Survey> => {
  const { id } = input;
  const [survey] = await Survey.findOrCreate({ where: { id }, defaults: input });

  return survey;
};

export default function (): void {
  before(async function () {
    this.input = mocker.survey();
    this.survey = await refreshSurveyRecord(this.input);

    const baseUrl = '/api/admin/surveys';
    this.url = `${baseUrl}/${this.survey.id}`;
    this.invalidUrl = `${baseUrl}/999999`;
  });

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).delete(this.url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it('should return 403 when missing permission', async function () {
    await setPermission([]);

    const { status } = await request(this.app)
      .delete(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  it('should return 403 when missing survey-specific permission', async function () {
    await setPermission('surveys-delete');

    const { status } = await request(this.app)
      .delete(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  it(`should return 403 when missing 'surveys-delete' permission (surveyadmin)`, async function () {
    await setPermission('surveyadmin');

    const { status } = await request(this.app)
      .delete(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  it(`should return 403 when missing 'surveys-delete' permission (surveyStaff)`, async function () {
    await setPermission(surveyStaff(this.survey.id));

    const { status } = await request(this.app)
      .delete(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  it(`should return 404 when record doesn't exist`, async function () {
    await setPermission(['surveys-delete', 'surveyadmin']);

    const { status } = await request(this.app)
      .delete(this.invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(404);
  });

  it('should return 204 and no content (surveyadmin)', async function () {
    this.survey = await refreshSurveyRecord(this.input);
    await setPermission(['surveys-delete', 'surveyadmin']);

    const { status, body } = await request(this.app)
      .delete(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(204);
    expect(body).to.be.empty;
  });

  it('should return 204 and no content (surveyStaff)', async function () {
    this.survey = await refreshSurveyRecord(this.input);
    await setPermission(['surveys-delete', surveyStaff(this.survey.id)]);

    const { status, body } = await request(this.app)
      .delete(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(204);
    expect(body).to.be.empty;
  });
}
