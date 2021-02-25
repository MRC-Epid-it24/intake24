import { CustomField } from '@common/types';
import { expect } from 'chai';
import { pick, omit } from 'lodash';
import request from 'supertest';
import { setPermission } from '../../mocks/helpers';
import * as mocker from '../../mocks/mocker';

export default function (): void {
  before(async function () {
    this.input = mocker.user();
    this.output = omit(this.input, ['password', 'passwordConfirm', 'permissions', 'roles']);

    this.url = '/api/admin/users';
  });

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).post(this.url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it('should return 403 when missing permission', async function () {
    await setPermission('acl');

    const { status } = await request(this.app)
      .post(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.user);

    expect(status).to.equal(403);
  });

  describe('with correct permissions', function () {
    before(async function () {
      await setPermission(['acl', 'users-create']);
    });

    it('should return 422 when missing input data', async function () {
      const { status, body } = await request(this.app)
        .post(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user);

      expect(status).to.equal(422);
      expect(body).to.be.an('object').to.have.keys('errors', 'success');
      expect(body.errors).to.have.keys('password', 'passwordConfirm', 'permissions', 'roles');
    });

    it('should return 422 when invalid input data', async function () {
      const { status, body } = await request(this.app)
        .post(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user)
        .send({
          email: 'invalidEmailFormat',
          multiFactorAuthentication: 10,
          emailNotifications: 'string',
          smsNotifications: [100],
          customFields: 'invalidCustomFields',
          permissions: [1, 'invalidId', 2],
          roles: [1, 'invalidId', 2],
        });

      expect(status).to.equal(422);
      expect(body).to.be.an('object').to.have.keys('errors', 'success');
      expect(body.errors).to.have.keys(
        'email',
        'password',
        'passwordConfirm',
        'multiFactorAuthentication',
        'emailNotifications',
        'smsNotifications',
        'customFields',
        'permissions',
        'roles'
      );
    });

    it('should return 201 and new resource', async function () {
      const { status, body } = await request(this.app)
        .post(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user)
        .send(this.input);

      expect(status).to.equal(201);
      expect(body).to.be.an('object').to.have.key('data');

      // Extract custom fields for non-order specific comparison
      const { customFields: resCustomFields, ...data } = body.data;
      const { customFields: outputCustomFields, ...output } = this.output;

      // 1) match the output
      expect(pick(data, Object.keys(output))).to.deep.equal(output);

      // 2) non-order specific custom field comparison
      const fields = resCustomFields.map(({ name, value }: CustomField) => ({
        name,
        value,
      }));
      expect(fields).to.have.deep.members(outputCustomFields);
    });

    it('should return 422 when duplicate email', async function () {
      const { status, body } = await request(this.app)
        .post(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user)
        .send({ ...mocker.user(), email: this.input.email });

      expect(status).to.equal(422);
      expect(body).to.be.an('object').to.have.keys('errors', 'success');
      expect(body.errors).to.have.keys('email');
    });
  });
}
