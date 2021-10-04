import fs from 'fs-extra';
import { pick } from 'lodash';
import request from 'supertest';
import { downloadImage, suite, setPermission } from '@tests/integration/helpers';
import { AsServedImageEntry } from '@common/types/http/admin';

export default (): void => {
  const url = '/api/admin/images/as-served/asServedSetForImages/images';
  const invalidUrl = '/api/admin/images/as-served/invalidAsServedSetForImages/images';

  const fileName = 'asServedImage_001.jpg';
  const weight = 10;

  let filePath: string;
  let output: Pick<AsServedImageEntry, 'weight'>;

  beforeAll(async () => {
    filePath = await downloadImage('https://picsum.photos/1200/800.jpg', fileName);

    output = { weight };
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).post(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission('as-served-create');
    });

    it(`should return 404 when parent record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .post(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .field('weight', weight)
        .attach('image', fs.createReadStream(filePath), fileName);

      expect(status).toBe(404);
    });

    it('should return 422 when missing input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['image', 'weight']);
    });

    it('should return 422 when invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .field('weight', 'notANumber')
        .field('image', 'notAFile');

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['image', 'weight']);
    });

    it('should return 201 and new resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .field('weight', weight)
        .attach('image', fs.createReadStream(filePath), fileName);

      expect(status).toBe(201);
      expect(body).toContainAllKeys(['data']);
      expect(pick(body.data, Object.keys(output))).toEqual(output);
    });
  });
};
