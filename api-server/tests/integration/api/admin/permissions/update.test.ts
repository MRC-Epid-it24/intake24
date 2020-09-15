import { expect } from 'chai';
import { pick } from 'lodash';
import request from 'supertest';
import { Permission } from '@/db/models/system';
import { setPermission } from '../../mocks/helpers';
import * as mocker from '../../mocks/mocker';

export default async function (): Promise<void> {
  before(async function () {
    this.input = mocker.permission();
    this.updateInput = mocker.permission();

    const { name } = this.input;
    const { displayName, description } = this.updateInput;
    this.output = { name, displayName, description };

    this.permission = await Permission.create(this.input);

    const baseUrl = '/admin/permissions';
    this.url = `${baseUrl}/${this.permission.id}`;
    this.invalidUrl = `${baseUrl}/999999`;
  });

  it('should return 401 when no / invalid token', async function () {
    const res = await request(this.app).put(this.url).set('Accept', 'application/json');

    expect(res.status).to.equal(401);
  });

  it('should return 403 when missing permission', async function () {
    await setPermission('acl');

    const res = await request(this.app)
      .put(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(res.status).to.equal(403);
  });

  describe('resource input/data tests', function () {
    before(async function () {
      await setPermission(['acl', 'permissions-edit']);
    });

    it('should return 422 when missing input data', async function () {
      const res = await request(this.app)
        .put(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer);

      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object').to.have.keys('errors', 'success');
      expect(res.body.errors).to.have.keys('name', 'displayName');
    });

    it('should return 422 when invalid input data', async function () {
      const res = await request(this.app)
        .put(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer)
        .send({ name: '', displayName: '' });

      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object').to.have.keys('errors', 'success');
      expect(res.body.errors).to.have.keys('name', 'displayName');
    });

    it(`should return 404 when record doesn't exist`, async function () {
      const res = await request(this.app)
        .put(this.invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer)
        .send(this.updateInput);

      expect(res.status).to.equal(404);
    });

    it('should return 200 and data/refs', async function () {
      const res = await request(this.app)
        .put(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer)
        .send(this.updateInput);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object').to.have.keys('data', 'refs');
      expect(pick(res.body.data, Object.keys(this.input))).to.deep.equal(this.output);
    });
  });
}
