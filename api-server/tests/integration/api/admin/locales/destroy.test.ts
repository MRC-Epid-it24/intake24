import { expect } from 'chai';
import request from 'supertest';
import { Locale } from '@/db/models/system';
import { setPermission } from '../../mocks/helpers';

export default function (): void {
  before(async function () {
    const { id: langId } = this.data.language;
    this.input = {
      id: 'en-au',
      englishName: 'English - Australia',
      localName: 'English - Australia',
      respondentLanguageId: langId,
      adminLanguageId: langId,
      countryFlagCode: 'en-au',
      prototypeLocaleId: null,
      textDirection: 'ltr',
    };
    this.locale = await Locale.create(this.input);

    const baseUrl = '/api/admin/locales';
    this.url = `${baseUrl}/${this.locale.id}`;
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
      .set('Authorization', this.bearer.user);

    expect(status).to.equal(403);
  });

  describe('with correct permissions', function () {
    before(async function () {
      await setPermission('locales-delete');
    });

    it(`should return 404 when record doesn't exist`, async function () {
      const { status } = await request(this.app)
        .delete(this.invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user);

      expect(status).to.equal(404);
    });

    it(`should return 403 - can't delete locale for now`, async function () {
      const { status } = await request(this.app)
        .delete(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user);

      expect(status).to.equal(403);
    });

    /* it('should return 204 and no content', async function () {
      const { status, body } = await request(this.app)
        .delete(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user);

      expect(status).to.equal(204);
      expect(body).to.be.empty;
    }); */
  });
}
