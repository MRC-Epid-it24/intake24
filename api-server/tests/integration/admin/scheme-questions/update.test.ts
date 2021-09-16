import { pick } from 'lodash';
import request from 'supertest';
import { SchemeQuestionCreationAttributes } from '@common/types/models';
import { mocker, suite, setPermission } from '@tests/integration/helpers';
import { SchemeQuestion } from '@/db/models/system';

export default (): void => {
  const baseUrl = '/api/admin/scheme-questions';

  let url: string;
  let invalidUrl: string;

  let input: SchemeQuestionCreationAttributes;
  let updateInput: SchemeQuestionCreationAttributes;
  let schemeQuestion: SchemeQuestion;

  beforeAll(async () => {
    input = mocker.system.schemeQuestion();
    updateInput = mocker.system.schemeQuestion();

    schemeQuestion = await SchemeQuestion.create(input);

    url = `${baseUrl}/${schemeQuestion.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).put(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .put(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission('scheme-questions-edit');
    });

    it('should return 422 when missing input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['question']);
    });

    it('should return 422 when invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ question: { name: 'missingProps' } });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['question']);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .put(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(404);
    });

    it('should return 200 and data/refs', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['data', 'refs']);
      expect(pick(body.data, Object.keys(updateInput))).toEqual(updateInput);
    });
  });
};
