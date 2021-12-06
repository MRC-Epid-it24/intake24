import request from 'supertest';
import * as uuid from 'uuid';
import { suite } from '@tests/integration/helpers';
import { SurveySubmission } from '@api/db/models/system';

export default (): void => {
  let url: string;
  let surveyId: string;
  let userId: string;

  beforeAll(async () => {
    url = '/api/user/submissions';

    surveyId = suite.data.system.survey.id;
    userId = suite.data.system.respondent.userId;

    await SurveySubmission.create({
      id: uuid.v4(),
      surveyId,
      userId,
      startTime: new Date(),
      endTime: new Date(),
      submissionTime: new Date(),
      uxSessionId: uuid.v4(),
    });
  });

  afterAll(async () => {
    await SurveySubmission.destroy({ where: { userId } });
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 422 for missing surveyId query parameter', async () => {
    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys(['surveyId']);
  });

  it('should return 200 and array of submissions', async () => {
    const { status, body } = await request(suite.app)
      .get(`${url}?surveyId=${surveyId}`)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(200);
    expect(body).toBeArrayOfSize(1);
  });

  it('should return 200 and empty array of submissions for invalid survey', async () => {
    const { status, body } = await request(suite.app)
      .get(`${url}?surveyId=nonExistingSurvey`)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(200);
    expect(body).toBeArrayOfSize(0);
  });
};
