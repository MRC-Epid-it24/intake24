import { expect } from 'chai';
import { pick, omit } from 'lodash';
import request from 'supertest';
import ioc from '@/ioc';
import { CustomField } from '@common/types';
import { setPermission } from '../../mocks/helpers';
import * as mocker from '../../mocks/mocker';

export default function (): void {
  before(async function () {
    this.input = mocker.user();
    this.user = await ioc.cradle.userService.create(this.input);
    this.output = omit(this.input, ['password', 'passwordConfirm']);

    const baseUrl = '/api/admin/users';
    this.url = `${baseUrl}/${this.user.id}/edit`;
    this.invalidUrl = `${baseUrl}/999999/edit`;
  });

  it('should return 401 when no / invalid token', async function () {
    const { status } = await request(this.app).get(this.url).set('Accept', 'application/json');

    expect(status).to.equal(401);
  });

  it('should return 403 when missing permission', async function () {
    await setPermission('acl');

    const { status } = await request(this.app)
      .get(this.url)
      .set('Accept', 'application/json')
      .set('Authorization', this.bearer.user);

    expect(status).to.equal(403);
  });

  describe('with correct permissions', function () {
    before(async function () {
      await setPermission(['acl', 'users-edit']);
    });

    it(`should return 404 when record doesn't exist`, async function () {
      const { status } = await request(this.app)
        .get(this.invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user);

      expect(status).to.equal(404);
    });

    it('should return 200 and data/refs', async function () {
      const { status, body } = await request(this.app)
        .get(this.url)
        .set('Accept', 'application/json')
        .set('Authorization', this.bearer.user);

      expect(status).to.equal(200);
      expect(body).to.be.an('object').to.have.keys('data', 'refs');

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
  });
}
