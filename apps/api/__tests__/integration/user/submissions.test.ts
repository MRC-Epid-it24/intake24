import request from 'supertest';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { SurveySubmission } from '@intake24/db';

export default () => {
  const url = '/api/user/submissions';
  let surveyId: string;
  let surveySlug: string;
  let userId: string;

  beforeAll(async () => {
    surveyId = suite.data.system.survey.id;
    surveySlug = suite.data.system.survey.slug;
    userId = suite.data.system.respondent.userId;

    await SurveySubmission.create(mocker.system.submission(surveyId, userId));
  });

  afterAll(async () => {
    await SurveySubmission.destroy({ where: { userId } });
  });

  it('should return 401 when no / invalid token', async () => {
    await suite.sharedTests.assertMissingAuthentication('get', url, { bearer: 'respondent' });
  });

  it('should return 422 for missing surveyId query parameter', async () => {
    await suite.sharedTests.assertInvalidInput('get', url, ['survey'], { bearer: 'respondent' });
  });

  it('should return 404 for invalid survey', async () => {
    await suite.sharedTests.assertMissingRecord('get', `${url}?survey=nonExistingSurvey`, {
      bearer: 'respondent',
    });
  });

  it('should return 200 and array of submissions', async () => {
    const { status, body } = await request(suite.app)
      .get(`${url}?survey=${surveySlug}`)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(200);
    expect(body).toBeArrayOfSize(1);
  });
};
