import { pick } from 'lodash';
import request from 'supertest';
import { SurveyRequest } from '@common/types/http/admin';
import { mocker, suite, setPermission } from '@tests/integration/helpers';

export default (): void => {
  const url = '/api/admin/surveys';

  let input: SurveyRequest;
  let output: SurveyRequest;

  beforeAll(async () => {
    input = mocker.system.survey();
    output = { ...input, supportEmail: input.supportEmail.toLowerCase() };
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
      await setPermission('surveys-create');
    });

    it('should return 422 for missing input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys([
        'id',
        'name',
        'state',
        'startDate',
        'endDate',
        'schemeId',
        'localeId',
        'supportEmail',
        'allowGenUsers',
        'feedbackEnabled',
        'storeUserSessionOnServer',
        'overrides',
      ]);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          id: null,
          name: [2, 0],
          state: 10,
          startDate: 'notValidDate',
          endDate: 100,
          schemeId: 'invalidSchemeId',
          locale: 10,
          supportEmail: 'thisIsNotValidEmail',
          allowGenUsers: 'no',
          feedbackEnabled: 10,
          numberOfSubmissionsForFeedback: 'number',
          storeUserSessionOnServer: 'yes',
          maximumDailySubmissions: 'NaN',
          minimumSubmissionInterval: { nan: 5 },
          authUrlTokenCharset: 'abcabc',
          authUrlTokenLength: 'this is not a number',
          searchSortingAlgorithm: 'invalid-search-algorithm',
          searchMatchScoreWeight: 500,
          overrides: {
            meals: ['shouldBeProperlyFormatMealList'],
            questions: 'invalidQuestions',
          },
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys([
        'id',
        'name',
        'state',
        'startDate',
        'endDate',
        'schemeId',
        'localeId',
        'supportEmail',
        'allowGenUsers',
        'feedbackEnabled',
        'numberOfSubmissionsForFeedback',
        'storeUserSessionOnServer',
        'maximumDailySubmissions',
        'minimumSubmissionInterval',
        'authUrlTokenCharset',
        'authUrlTokenLength',
        'searchSortingAlgorithm',
        'searchMatchScoreWeight',
        'overrides',
      ]);
    });

    it('should return 201 and new resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(status).toBe(201);
      expect(body).toContainAllKeys(['data']);
      expect(pick(body.data, Object.keys(output))).toEqual(output);
    });

    it('should return 422 for duplicate id', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ ...mocker.system.survey(), id: input.id });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['id']);
    });

    it('should return 422 for duplicate name', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ ...mocker.system.survey(), name: input.name });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['name']);
    });
  });
};
