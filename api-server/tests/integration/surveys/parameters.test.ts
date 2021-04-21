import request from 'supertest';
import { suite } from '@tests/integration/helpers';

export default (): void => {
  let url: string;
  let invalidUrl: string;

  beforeAll(async () => {
    url = `/api/surveys/${suite.data.survey.id}/parameters`;
    invalidUrl = `/api/surveys/invalid-survey/parameters`;
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it(`should return 403 when survey record (+survey permissions) doesn't exist`, async () => {
    const { status } = await request(suite.app)
      .get(invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(403);
  });

  it('should return 200 and public survey record', async () => {
    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(200);
    expect(body).toContainAllKeys([
      'id',
      'name',
      'state',
      'localeId',
      'scheme',
      'numberOfSubmissionsForFeedback',
      'storeUserSessionOnServer',
      'suspensionReason',
    ]);
  });
};
