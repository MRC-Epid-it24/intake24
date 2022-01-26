import { pick } from 'lodash';
import request from 'supertest';
import { SchemeCreationAttributes } from '@intake24/common/types/models';
import { mocker, suite, setPermission } from '@intake24/api-tests/integration/helpers';
import { Scheme } from '@intake24/db';

export default (): void => {
  const url = '/api/admin/schemes/copy';

  let input: SchemeCreationAttributes;
  let output: SchemeCreationAttributes;

  beforeAll(async () => {
    input = mocker.system.scheme();

    const { id, name } = mocker.system.scheme();
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
      await setPermission('schemes|edit');
    });

    it('should return 422 for missing input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['sourceId', 'id', 'name']);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ sourceId: false, id: ['invalidId'], name: { name: 'objectName' } });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['sourceId', 'id', 'name']);
    });

    it('should return 422 for same id/name provided', async () => {
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

    it('should return 200 and data', async () => {
      const { id, name } = output;

      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ sourceId: input.id, id, name });

      expect(status).toBe(200);
      expect(pick(body, Object.keys(input))).toEqual(output);
    });
  });
};
