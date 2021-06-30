import fs from 'fs-extra';
import request from 'supertest';
import { downloadImage, suite, setPermission } from '@tests/integration/helpers';

export default (): void => {
  const baseUrl = '/api/admin/images/as-served/asServedSetForImages/images';
  const invalidBaseUrl = '/api/admin/images/as-served/InvalidAsServedSetForImages/images';

  const fileName = 'asServedImage_003.jpg';
  const weight = 10;

  let url: string;
  const invalidUrl = `${baseUrl}/999999`;
  let invalidParentUrl: string;

  let filePath: string;

  beforeAll(async () => {
    filePath = await downloadImage('https://picsum.photos/1200/800.jpg', fileName);
    const { body } = await request(suite.app)
      .post(baseUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.superuser)
      .field('weight', weight)
      .attach('image', fs.createReadStream(filePath), fileName);

    const output = { ...body.data };

    url = `${baseUrl}/${output.id}`;
    invalidParentUrl = `${invalidBaseUrl}/${output.id}`;
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

    it(`should return 404 when parent record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .delete(invalidParentUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(404);
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
