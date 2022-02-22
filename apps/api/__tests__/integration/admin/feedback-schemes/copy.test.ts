import { pick } from 'lodash';
import request from 'supertest';
import { FeedbackSchemeCreationAttributes } from '@intake24/common/types/models';
import { mocker, suite, setPermission } from '@intake24/api-tests/integration/helpers';
import { FeedbackScheme } from '@intake24/db';

export default (): void => {
  const url = '/api/admin/feedback-schemes/copy';

  let input: FeedbackSchemeCreationAttributes;
  let output: FeedbackSchemeCreationAttributes;
  let scheme: FeedbackScheme;

  beforeAll(async () => {
    input = mocker.system.feedbackScheme();

    const { name } = mocker.system.feedbackScheme();
    output = { ...input, name };

    scheme = await FeedbackScheme.create(input);
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
      await setPermission('feedback-schemes|edit');
    });

    it('should return 422 for missing input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['sourceId', 'name']);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ sourceId: false, name: { name: 'objectName' } });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['sourceId', 'name']);
    });

    it('should return 422 for same id/name provided', async () => {
      const { name } = input;

      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ sourceId: scheme.id, name });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['name']);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { name } = output;

      const { status } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ sourceId: '999999', name });

      expect(status).toBe(404);
    });

    it('should return 200 and data', async () => {
      const { name } = output;

      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ sourceId: scheme.id, name });

      expect(status).toBe(200);
      expect(pick(body, Object.keys(input))).toEqual(output);
    });
  });
};
