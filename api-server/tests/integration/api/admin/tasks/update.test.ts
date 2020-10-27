import { expect } from 'chai';
import { pick } from 'lodash';
import request from 'supertest';
import { Task } from '@/db/models/system';
import { setPermission } from '../../mocks/helpers';
import * as mocker from '../../mocks/mocker';

export default function (): void {
  before(async function () {
    this.input = mocker.task();
    this.updateInput = mocker.task();

    this.task = await Task.create(this.input);

    const baseUrl = '/api/admin/tasks';
    this.url = `${baseUrl}/${this.task.id}`;
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
      .set('Authorization', this.bearer);

    expect(status).to.equal(403);
  });

  describe('with correct permissions', function () {
    before(async function () {
      await setPermission('tasks-edit');
    });

    it('should return 422 when missing input data', async function () {
      const { status, body } = await request(this.app)
        .put(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer);

      expect(status).to.equal(422);
      expect(body).to.be.an('object').to.have.keys('errors', 'success');
      expect(body.errors).to.have.keys('name', 'job', 'cron', 'active');
    });

    it('should return 422 when invalid input data', async function () {
      const { status, body } = await request(this.app)
        .put(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer)
        .send({
          name: null,
          job: true,
          cron: false,
          active: 'not-a-boolean',
          description: ['should just be string', 'should just be string'],
        });

      expect(status).to.equal(422);
      expect(body).to.be.an('object').to.have.keys('errors', 'success');
      expect(body.errors).to.have.keys('name', 'job', 'cron', 'active', 'description');
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
      expect(pick(body.data, Object.keys(this.updateInput))).to.deep.equal(this.updateInput);
    });
  });
}
