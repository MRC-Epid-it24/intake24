import { expect } from 'chai';
import { pick } from 'lodash';
import request from 'supertest';
import { setPermission } from '../../mocks/helpers';
import * as mocker from '../../mocks/mocker';

export default function (): void {
  before(async function () {
    this.input = mocker.locale(this.data.language.id);
    this.output = { ...this.input };

    this.url = '/api/admin/locales';
  });

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).post(this.url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it('should return 403 when missing permission', async function () {
    await setPermission([]);

    const { status } = await request(this.app)
      .post(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  describe('with correct permissions', function () {
    before(async function () {
      await setPermission('locales-create');
    });

    it('should return 422 when missing input data', async function () {
      const { status, body } = await request(this.app)
        .post(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer);

      expect(status).to.equal(422);
      expect(body).to.be.an('object').to.have.keys('errors', 'success');
      expect(body.errors).to.have.keys(
        'id',
        'englishName',
        'localName',
        'respondentLanguageId',
        'adminLanguageId',
        'countryFlagCode',
        'textDirection'
      );
    });

    it('should return 422 when invalid input data', async function () {
      const { status, body } = await request(this.app)
        .post(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer)
        .send({
          id: null,
          englishName: [],
          localName: ['dddsds', 'dffd'],
          respondentLanguageId: 'nonLocaleString',
          adminLanguageId: 5,
          countryFlagCode: 5,
          prototypeLocaleId: 'nonExistingLocale',
          textDirection: 'wrongDirection',
        });

      expect(status).to.equal(422);
      expect(body).to.be.an('object').to.have.keys('errors', 'success');
      expect(body.errors).to.have.keys(
        'id',
        'englishName',
        'localName',
        'respondentLanguageId',
        'adminLanguageId',
        'countryFlagCode',
        'prototypeLocaleId',
        'textDirection'
      );
    });

    it('should return 201 and new resource', async function () {
      const { status, body } = await request(this.app)
        .post(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer)
        .send(this.input);

      expect(status).to.equal(201);
      expect(body).to.be.an('object').to.have.key('data');
      expect(pick(body.data, Object.keys(this.output))).to.deep.equal(this.output);
    });

    it('should return 422 when duplicate id', async function () {
      const { status, body } = await request(this.app)
        .post(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer)
        .send({ ...mocker.locale(this.data.language.id), id: this.input.id });

      expect(status).to.equal(422);
      expect(body).to.be.an('object').to.have.keys('errors', 'success');
      expect(body.errors).to.have.keys('id');
    });
  });
}
