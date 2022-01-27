import request from 'supertest';
import {
  SurveySchemeCreationAttributes,
  SurveySchemeQuestionCreationAttributes,
} from '@intake24/common/types/models';
import { mocker, suite, setPermission } from '@intake24/api-tests/integration/helpers';
import { SurveyScheme, SurveySchemeQuestion } from '@intake24/db';

export default (): void => {
  const baseUrl = '/api/admin/survey-scheme-questions';

  let url: string;
  let invalidUrl: string;

  let schemeInput: SurveySchemeCreationAttributes;
  let schemeQuestionInput: SurveySchemeQuestionCreationAttributes;
  let syncInput: any;

  let scheme: SurveyScheme;
  let schemeQuestion: SurveySchemeQuestion;

  beforeAll(async () => {
    schemeInput = mocker.system.surveyScheme();
    schemeQuestionInput = mocker.system.surveySchemeQuestion();

    schemeInput = {
      ...schemeInput,
      questions: {
        ...schemeInput.questions,
        preMeals: [schemeQuestionInput.question],
      },
    };

    schemeQuestion = await SurveySchemeQuestion.create(schemeQuestionInput);
    scheme = await SurveyScheme.create(schemeInput);

    syncInput = {
      surveySchemeId: scheme.id,
      section: 'preMeals',
      question: {
        ...mocker.system.surveySchemeQuestion().question,
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
      await setPermission('survey-scheme-questions|sync');
    });

    it('should return 422 for missing input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['surveySchemeId', 'section', 'question']);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          surveySchemeId: ['123456'],
          section: 'notValidSchemeSection',
          question: { name: 'missingProps' },
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['surveySchemeId', 'section', 'question']);
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
        .send({ ...syncInput, surveySchemeId: '987654' });

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

    it('should return 200 and data', async () => {
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
