import request from 'supertest';

import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  let url: string;
  let invalidUrl: string;

  beforeAll(async () => {
    url = `/api/surveys/${suite.data.system.survey.slug}/follow-up`;
    invalidUrl = `/api/surveys/invalid-survey/follow-up`;
  });

  it('should return 401 when no / invalid token', async () => {
    await suite.sharedTests.assertMissingAuthentication('get', url);
  });

  it(`should return 403 when survey record (+survey permissions) doesn't exist`, async () => {
    const { status } = await request(suite.app)
      .get(invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(403);
  });

  it('should return 200 and follow-up info', async () => {
    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(200);
    expect(body).toContainAllKeys(['followUpUrl', 'showFeedback']);
  });
};
