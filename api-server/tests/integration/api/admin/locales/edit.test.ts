import { expect } from 'chai';
import { pick } from 'lodash';
import request from 'supertest';
import { Locale } from '@/db/models/system';
import { setPermission } from '../../mocks/helpers';
import * as mocker from '../../mocks/mocker';

export default function (): void {
  before(async function () {
    this.input = mocker.locale(this.data.language.id);
    this.locale = await Locale.create(this.input);
    this.output = { ...this.input };

    const baseUrl = '/api/admin/locales';
    this.url = `${baseUrl}/${this.locale.id}/edit`;
    this.invalidUrl = `${baseUrl}/999999/edit`;
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

  describe('with correct permissions', function () {
    before(async function () {
      await setPermission('locales-edit');
    });

    it(`should return 404 when record doesn't exist`, async function () {
      const { status } = await request(this.app)
        .get(this.invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer);

      expect(status).to.equal(404);
    });

    it('should return 200 and data/refs', async function () {
      const { status, body } = await request(this.app)
        .get(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer);

      expect(status).to.equal(200);
      expect(body).to.be.an('object').to.have.keys('data', 'refs');
      expect(pick(body.data, Object.keys(this.output))).to.deep.equal(this.output);
    });
  });
}
