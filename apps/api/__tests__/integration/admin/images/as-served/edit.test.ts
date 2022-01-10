import fs from 'fs-extra';
import { pick } from 'lodash';
import request from 'supertest';
import { suite, setPermission } from '@intake24/api-tests/integration/helpers';
import { AsServedSetEntry } from '@intake24/common/types/http/admin';

export default (): void => {
  const baseUrl = '/api/admin/images/as-served';

  const fileName = 'asServedSet_003.jpg';
  const id = 'asServedSet_003';
  const description = 'asServedSet_003_description';

  const url = `${baseUrl}/${id}/edit`;
  const invalidUrl = `${baseUrl}/999999/edit`;

  let output: AsServedSetEntry;

  beforeAll(async () => {
    const { body } = await request(suite.app)
      .post(baseUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.superuser)
      .field('id', id)
      .field('description', description)
      .attach('selectionImage', fs.createReadStream(suite.files.images.jpg), fileName);

    output = { ...body };
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission('as-served-edit');
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .get(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(404);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(200);
      expect(pick(body, Object.keys(output))).toEqual(output);
    });
  });
};
