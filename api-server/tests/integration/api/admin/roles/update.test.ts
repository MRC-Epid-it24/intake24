import { expect } from 'chai';
import { pick, times } from 'lodash';
import request from 'supertest';
import { Role, Permission } from '@/db/models/system';
import { setPermission } from '../../mocks/helpers';
import * as mocker from '../../mocks/mocker';

export default function (): void {
  before(async function () {
    this.input = mocker.role();
    this.updateInput = mocker.role();

    const permissionInput = times(3, () => mocker.permission());
    this.permissions = await Permission.bulkCreate(permissionInput);
    this.updateInput.permissions = this.permissions.map((item: Permission) => item.id);

    const { name } = this.input;
    this.output = { ...this.updateInput, name };

    this.role = await Role.create(this.input);

    const baseUrl = '/api/admin/roles';
    this.url = `${baseUrl}/${this.role.id}`;
    this.invalidUrl = `${baseUrl}/999999`;
  });

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).put(this.url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it('should return 403 when missing permission', async function () {
    await setPermission('acl');

    const { status } = await request(this.app)
      .put(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  describe('with correct permissions', function () {
    before(async function () {
      await setPermission(['acl', 'roles-edit']);
    });

    it('should return 422 when missing input data', async function () {
      const { status, body } = await request(this.app)
        .put(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer);

      expect(status).to.equal(422);
      expect(body).to.be.an('object').to.have.keys('errors', 'success');
      expect(body.errors).to.have.keys('name', 'displayName', 'permissions');
    });

    it('should return 422 when invalid input data', async function () {
      const { status, body } = await request(this.app)
        .put(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer)
        .send({ name: '', displayName: '', permissions: [1, 'invalidId', 2] });

      expect(status).to.equal(422);
      expect(body).to.be.an('object').to.have.keys('errors', 'success');
      expect(body.errors).to.have.keys('name', 'displayName', 'permissions');
    });

    it(`should return 404 when record doesn't exist`, async function () {
      const { status } = await request(this.app)
        .put(this.invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer)
        .send(this.updateInput);

      expect(status).to.equal(404);
    });

    it('should return 200 and data/refs', async function () {
      const { status, body } = await request(this.app)
        .put(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer)
        .send(this.updateInput);

      expect(status).to.equal(200);
      expect(body).to.be.an('object').to.have.keys('data', 'refs');

      const data = {
        ...body.data,
        permissions: body.data.permissions.map((item: Permission) => item.id),
      };

      expect(pick(data, Object.keys(this.output))).to.deep.equal(this.output);
    });
  });
}
