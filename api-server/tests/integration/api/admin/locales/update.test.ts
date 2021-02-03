import { expect } from 'chai';
import { pick } from 'lodash';
import request from 'supertest';
import { Locale } from '@/db/models/system';
import { setPermission } from '../../mocks/helpers';

export default function (): void {
  before(async function () {
    const { id: langId } = this.data.language;
    this.input = {
      id: 'en-ie',
      englishName: 'English - Ireland',
      localName: 'English - Ireland',
      respondentLanguageId: langId,
      adminLanguageId: langId,
      countryFlagCode: 'en-ie',
      prototypeLocaleId: null,
      textDirection: 'ltr',
    };
    this.updateInput = {
      id: 'en-jm',
      englishName: 'English - Jamaica',
      localName: 'English - Jamaica',
      respondentLanguageId: langId,
      adminLanguageId: langId,
      countryFlagCode: 'en-jm',
      prototypeLocaleId: null,
      textDirection: 'ltr',
    };

    const { id } = this.input;
    this.output = { ...this.updateInput, id };

    this.locale = await Locale.create(this.input);

    const baseUrl = '/api/admin/locales';
    this.url = `${baseUrl}/${this.locale.id}`;
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

  describe('with correct permissions', function () {
    before(async function () {
      await setPermission('locales-edit');
    });

    it('should return 422 when missing input data', async function () {
      const { status, body } = await request(this.app)
        .put(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user);

      expect(status).to.equal(422);
      expect(body).to.be.an('object').to.have.keys('errors', 'success');
      expect(body.errors).to.have.keys(
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
        .put(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user)
        .send({
          englishName: { name: 'United Kingdom' },
          localName: ['United Kingdom'],
          respondentLanguageId: 10,
          adminLanguageId: 'nonLocaleString',
          countryFlagCode: false,
          prototypeLocaleId: 'nonExistingLocale',
          textDirection: 'wrongDirection',
        });

      expect(status).to.equal(422);
      expect(body).to.be.an('object').to.have.keys('errors', 'success');
      expect(body.errors).to.have.keys(
        'englishName',
        'localName',
        'respondentLanguageId',
        'adminLanguageId',
        'countryFlagCode',
        'prototypeLocaleId',
        'textDirection'
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
