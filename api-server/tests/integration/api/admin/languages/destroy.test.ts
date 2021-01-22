import { expect } from 'chai';
import request from 'supertest';
import { Language, Locale } from '@/db/models/system';
import { setPermission } from '../../mocks/helpers';
import * as mocker from '../../mocks/mocker';

export default function (): void {
  before(async function () {
    this.input = mocker.language();
    this.language = await Language.create(this.input);

    const baseUrl = '/api/admin/languages';
    this.url = `${baseUrl}/${this.language.id}`;
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
      await setPermission('languages-delete');
    });

    it(`should return 404 when record doesn't exist`, async function () {
      const { status } = await request(this.app)
        .delete(this.invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user);

      expect(status).to.equal(404);
    });

    it('should return 204 and no content', async function () {
      const { status, body } = await request(this.app)
        .delete(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user);

      expect(status).to.equal(204);
      expect(body).to.be.empty;
    });

    it(`should return 403 when language is assigned to locales`, async function () {
      const { id } = await Language.create(mocker.language());
      await Locale.create(mocker.locale(id, id));

      const url = `/api/admin/languages/${id}`;

      const { status } = await request(this.app)
        .delete(url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user);

      expect(status).to.equal(403);
    });
  });
}
