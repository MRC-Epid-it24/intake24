import request from 'supertest';

import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/i18n';

  it('should return 200 and list of available languages', async () => {
    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(200);
    expect(body).toBeArray();
    expect(body).not.toBeEmpty();

    for (const language of body) {
      expect(language).toContainAllKeys(['id', 'englishName', 'localName', 'countryFlagCode']);
    }
  });
};
