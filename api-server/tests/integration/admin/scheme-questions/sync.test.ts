import request from 'supertest';
import { SchemeCreationAttributes, SchemeQuestionCreationAttributes } from '@common/types/models';
import { mocker, suite, setPermission } from '@tests/integration/helpers';
import { Scheme, SchemeQuestion } from '@/db/models/system';

export default (): void => {
  const baseUrl = '/api/admin/scheme-questions';

  let url: string;
  let invalidUrl: string;

  let schemeInput: SchemeCreationAttributes;
  let schemeQuestionInput: SchemeQuestionCreationAttributes;
  let syncInput: any;

  let scheme: Scheme;
  let schemeQuestion: SchemeQuestion;

  beforeAll(async () => {
    schemeInput = mocker.scheme();
    schemeQuestionInput = mocker.schemeQuestion();

    schemeInput = {
      ...schemeInput,
      questions: {
        ...schemeInput.questions,
        preMeals: [schemeQuestionInput.question],
      },
    };

    schemeQuestion = await SchemeQuestion.create(schemeQuestionInput);
    scheme = await Scheme.create(schemeInput);

    syncInput = {
      schemeId: scheme.id,
      section: 'preMeals',
      question: {
        ...mocker.schemeQuestion().question,
        id: schemeQuestionInput.question.id,
      },
    };

    url = `${baseUrl}/${schemeQuestion.id}/sync`;
    invalidUrl = `${baseUrl}/999999/sync`;
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
      await setPermission('scheme-questions-sync');
    });

    it('should return 422 when missing input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['schemeId', 'section', 'question']);
    });

    it('should return 422 when invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          schemeId: ['invalidSchemeIdFormat'],
          section: 'notValidSchemeSection',
          question: { name: 'missingProps' },
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['schemeId', 'section', 'question']);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .post(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(syncInput);

      expect(status).toBe(404);
    });

    it(`should return 404 when scheme record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .post(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ ...syncInput, schemeId: 'invalidScheme' });

      expect(status).toBe(404);
    });

    it(`should return 404 when question is not in correct section`, async () => {
      const { status } = await request(suite.app)
        .post(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ ...syncInput, section: 'postMeals' });

      expect(status).toBe(404);
    });

    it(`should return 404 when question ID is not found in scheme questions set`, async () => {
      const { status } = await request(suite.app)
        .post(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ ...syncInput, question: { ...syncInput.question, id: 'invalidQuestionId' } });

      expect(status).toBe(404);
    });

    it('should return 200 and data/refs', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(syncInput);

      expect(status).toBe(200);
      expect(body).toBeEmpty();
    });
  });
};
