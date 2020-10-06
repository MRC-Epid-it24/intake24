import { expect } from 'chai';
import request from 'supertest';
import { Permission } from '@/db/models/system';
import { setPermission } from '../../mocks/helpers';
import * as mocker from '../../mocks/mocker';

export default function (): void {
  before(async function () {
    this.input = mocker.permission();
    this.permission = await Permission.create(this.input);

    const baseUrl = '/api/admin/permissions';
    this.url = `${baseUrl}/${this.permission.id}`;
    this.invalidUrl = `${baseUrl}/999999`;
  });

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).delete(this.url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it('should return 403 when missing permission', async function () {
    await setPermission('acl');

    const { status } = await request(this.app)
      .delete(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  describe('with correct permissions', function () {
    before(async function () {
      await setPermission(['acl', 'permissions-delete']);
    });

    it(`should return 404 when record doesn't exist`, async function () {
      const { status } = await request(this.app)
        .delete(this.invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer);

      expect(status).to.equal(404);
    });

    it('should return 204 and no content', async function () {
      const { status, body } = await request(this.app)
        .delete(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer);

      expect(status).to.equal(204);
      expect(body).to.be.empty;
    });
  });
}
