import { expect } from 'chai';
import { pick } from 'lodash';
import request from 'supertest';
import { setPermission } from '../../mocks/helpers';
import * as mocker from '../../mocks/mocker';

export default function (this: Mocha.Suite): void {
  before(async function () {
    this.input = mocker.permission();
    this.url = '/admin/permissions';
  });

  it('should return 401 when no / invalid token', async function () {
    const res = await request(this.app).post(this.url).set('Accept', 'application/json');

    expect(res.status).to.equal(401);
  });

  it('should return 403 when missing permission', async function () {
    await setPermission('acl');

    const res = await request(this.app)
      .post(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer);

    expect(res.status).to.equal(403);
  });

  describe('resource input/data tests', function () {
    before(async function () {
      await setPermission(['acl', 'permissions-create']);
    });

    it('should return 422 when missing input data', async function () {
      const res = await request(this.app)
        .post(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer);

      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object').to.have.keys('errors', 'success');
      expect(res.body.errors).to.have.keys('name', 'displayName');
    });

    it('should return 422 when invalid input data', async function () {
      const res = await request(this.app)
        .post(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer)
        .send({ name: '', displayName: '' });

      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object').to.have.keys('errors', 'success');
      expect(res.body.errors).to.have.keys('name', 'displayName');
    });

    it('should return 201 and new resource', async function () {
      const res = await request(this.app)
        .post(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer)
        .send(this.input);

      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object').to.have.key('data');
      expect(pick(res.body.data, Object.keys(this.input))).to.deep.equal(this.input);
    });

    it('should return 422 when duplicate name', async function () {
      const res = await request(this.app)
        .post(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer)
        .send(this.input);

      expect(res.status).to.equal(422);
      expect(res.body).to.be.an('object').to.have.keys('errors', 'success');
      expect(res.body.errors).to.have.keys('name');
    });
  });
}
