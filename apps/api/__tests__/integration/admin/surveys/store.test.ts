import { pick } from 'lodash';
import request from 'supertest';
import { SurveyRequest } from '@intake24/common/types/http/admin';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/surveys';

  let input: SurveyRequest;
  let output: SurveyRequest;

  beforeAll(async () => {
    input = mocker.system.survey();
    output = { ...input, supportEmail: input.supportEmail.toLowerCase() };
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url);
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission('surveys|create');
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertMissingInput('post', url, [
        'id',
        'name',
        'state',
        'startDate',
        'endDate',
        'surveySchemeId',
        'localeId',
        'supportEmail',
        'allowGenUsers',
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
          surveySchemeId: '999999',
          locale: 10,
          supportEmail: 'thisIsNotValidEmail',
          allowGenUsers: 'no',
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
        'surveySchemeId',
        'localeId',
        'supportEmail',
        'allowGenUsers',
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
      expect(pick(body, Object.keys(output))).toEqual(output);
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
