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
    this.updateInput = mocker.survey();

    const { id } = this.input;
    this.output = { ...this.updateInput, id };

    this.survey = await Survey.create(this.input);

    const baseUrl = '/api/admin/surveys';
    this.url = `${baseUrl}/${this.survey.id}`;
    this.invalidUrl = `${baseUrl}/999999`;
  });

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).put(this.url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it('should return 403 when missing permission', async function () {
    await setPermission([]);

    const { status } = await request(this.app)
      .put(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.user);

    expect(status).to.equal(403);
  });

  it('should return 403 when missing survey-specific permission', async function () {
    await setPermission('surveys-edit');

    const { status } = await request(this.app)
      .put(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.user);

    expect(status).to.equal(403);
  });

  it(`should return 403 when missing 'surveys-edit' permission (surveyadmin)`, async function () {
    await setPermission('surveyadmin');

    const { status } = await request(this.app)
      .put(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.user);

    expect(status).to.equal(403);
  });

  it(`should return 403 when missing 'surveys-edit' permission (surveyStaff)`, async function () {
    await setPermission(surveyStaff(this.survey.id));

    const { status } = await request(this.app)
      .put(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.user);

    expect(status).to.equal(403);
  });

  describe('with correct permissions', function () {
    before(async function () {
      await setPermission(['surveys-edit', 'surveyadmin']);
    });

    it('should return 422 when missing input data', async function () {
      const { status, body } = await request(this.app)
        .put(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user);

      expect(status).to.equal(422);
      expect(body).to.be.an('object').to.have.keys('errors', 'success');
      expect(body.errors).to.have.keys(
        'state',
        'startDate',
        'endDate',
        'schemeId',
        'localeId',
        'supportEmail',
        'allowGenUsers',
        'feedbackEnabled',
        'numberOfSubmissionsForFeedback',
        'storeUserSessionOnServer',
        'maximumDailySubmissions',
        'minimumSubmissionInterval'
      );
    });

    it('should return 422 when invalid input data', async function () {
      const { status, body } = await request(this.app)
        .put(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user)
        .send({
          state: 10,
          startDate: 'notValidDate',
          endDate: 100,
          schemeId: 'invalidSchemeId',
          locale: 10,
          supportEmail: 'thisIsNotValidEmail',
          allowGenUsers: 'no',
          feedbackEnabled: 10,
          numberOfSubmissionsForFeedback: 'number',
          storeUserSessionOnServer: 'yes',
          maximumDailySubmissions: 'NaN',
          minimumSubmissionInterval: { nan: 5 },
        });

      expect(status).to.equal(422);
      expect(body).to.be.an('object').to.have.keys('errors', 'success');
      expect(body.errors).to.have.keys(
        'state',
        'startDate',
        'endDate',
        'schemeId',
        'localeId',
        'supportEmail',
        'allowGenUsers',
        'feedbackEnabled',
        'numberOfSubmissionsForFeedback',
        'storeUserSessionOnServer',
        'maximumDailySubmissions',
        'minimumSubmissionInterval'
      );
    });

    it(`should return 404 when record doesn't exist`, async function () {
      const { status } = await request(this.app)
        .put(this.invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user)
        .send(this.updateInput);

      expect(status).to.equal(404);
    });

    it('should return 200 and data/refs', async function () {
      const { status, body } = await request(this.app)
        .put(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user)
        .send(this.updateInput);

      expect(status).to.equal(200);
      expect(body).to.be.an('object').to.have.keys('data', 'refs');
      expect(pick(body.data, Object.keys(this.output))).to.deep.equal(this.output);
    });
  });
}
