import { pick } from 'lodash';
import request from 'supertest';
import { Scheme } from '@/db/models/system';
import { Scheme as SchemeAttributes } from '@common/types/models';
import { mocker, suite, setPermission } from '../../helpers';

export default (): void => {
  const baseUrl = '/api/admin/schemes';

  let url: string;
  let invalidUrl: string;

  let input: Omit<SchemeAttributes, 'createdAt' | 'updatedAt'>;
  let output: Omit<SchemeAttributes, 'createdAt' | 'updatedAt'>;
  let scheme: Scheme;

  beforeAll(async () => {
    input = mocker.scheme();
    scheme = await Scheme.create(input);
    output = { ...input };

    url = `${baseUrl}/${scheme.id}/edit`;
    invalidUrl = `${baseUrl}/999999/edit`;
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
      await setPermission('schemes-edit');
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
