import fs from 'fs-extra';
import request from 'supertest';
import { downloadImage, suite, setPermission } from '@tests/integration/helpers';

export default (): void => {
  const baseUrl = '/api/admin/images/as-served';

  const fileName = 'asServedSet_005.jpg';
  const id = 'asServedSet_005';
  const description = 'asServedSet_005_description';

  const url = `${baseUrl}/${id}`;
  const invalidUrl = `${baseUrl}/999999`;

  let filePath: string;

  beforeAll(async () => {
    filePath = await downloadImage('https://picsum.photos/1200/800.jpg', fileName);
    await request(suite.app)
      .post(baseUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.superuser)
      .field('id', id)
      .field('description', description)
      .attach('selectionImage', fs.createReadStream(filePath), fileName);
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).delete(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .delete(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission('as-served-delete');
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .delete(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(404);
    });

    it('should return 204 and no content', async () => {
      const { status, body } = await request(suite.app)
        .delete(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(204);
      expect(body).toBeEmpty();
    });
  });
};
