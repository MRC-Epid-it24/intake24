import { pick } from 'lodash';
import request from 'supertest';
import { SchemeCreationAttributes } from '@common/types/models';
import { mocker, suite, setPermission } from '@tests/integration/helpers';

export default (): void => {
  const url = '/api/admin/schemes';

  let input: SchemeCreationAttributes;
  let output: SchemeCreationAttributes;

  beforeAll(async () => {
    input = mocker.scheme();
    output = { ...input };
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
      await setPermission('schemes-create');
    });

    it('should return 422 when missing input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['id', 'name', 'type', 'meals', 'questions', 'export']);
    });

    it('should return 422 when invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          id: null,
          name: [],
          type: 'invalidType',
          meals: 5,
          questions: [],
          export: 'notExportScheme',
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['id', 'name', 'type', 'meals', 'questions', 'export']);
    });

    it('should return 201 and new resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(body).toContainAllKeys(['data']);
      expect(pick(body.data, Object.keys(output))).toEqual(output);
      expect(status).toBe(201);
    });

    it('should return 422 when duplicate id', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ ...mocker.scheme(), id: input.id });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['id']);
    });

    it('should return 422 when duplicate name', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ ...mocker.scheme(), name: input.name });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['name']);
    });
  });
};
