import { pick } from 'lodash';
import request from 'supertest';
import { SchemeCreationAttributes } from '@common/types/models';
import { mocker, suite, setPermission } from '@tests/integration/helpers';
import { Scheme } from '@/db/models/system';

export default (): void => {
  const url = '/api/admin/schemes/copy';

  let input: SchemeCreationAttributes;
  let output: SchemeCreationAttributes;

  beforeAll(async () => {
    input = mocker.scheme();

    const { id, name } = mocker.scheme();
    output = { ...input, id, name };

    await Scheme.create(input);
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
      await setPermission('schemes-edit');
    });

    it('should return 422 when missing input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['sourceId', 'id', 'name']);
    });

    it('should return 422 when invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ sourceId: false, id: ['invalidId'], name: { name: 'objectName' } });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['sourceId', 'id', 'name']);
    });

    it('should return 422 when same id/name provided', async () => {
      const { id, name } = input;

      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ sourceId: id, id, name });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['id', 'name']);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { id, name } = output;

      const { status } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ sourceId: 'invalidSchemeId', id, name });

      expect(status).toBe(404);
    });

    it('should return 200 and data/refs', async () => {
      const { id, name } = output;

      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ sourceId: input.id, id, name });

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['data']);
      expect(pick(body.data, Object.keys(input))).toEqual(output);
    });
  });
};
