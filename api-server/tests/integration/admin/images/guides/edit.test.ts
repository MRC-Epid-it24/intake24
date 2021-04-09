import { pick } from 'lodash';
import request from 'supertest';
import { suite, setPermission } from '@tests/integration/helpers';
import { GuideImageEntry } from '@common/types/http/admin';

export default (): void => {
  const baseUrl = '/api/admin/images/guides';

  const input = {
    id: 'guideImage_003',
    description: 'guideImage_003_description',
    imageMapId: 'imageMapForGuide',
  };

  let output: GuideImageEntry;

  const url = `${baseUrl}/${input.id}/edit`;
  const invalidUrl = `${baseUrl}/999999/edit`;

  beforeAll(async () => {
    const { body } = await request(suite.app)
      .post(baseUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.admin)
      .send(input);

    output = { ...body.data };
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
      await setPermission('guide-images-edit');
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .get(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(404);
    });

    it('should return 200 and data/refs', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['data', 'refs']);
      expect(pick(body.data, Object.keys(output))).toEqual(output);
    });
  });
};
