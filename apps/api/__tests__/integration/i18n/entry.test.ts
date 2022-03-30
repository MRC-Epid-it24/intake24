import request from 'supertest';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const baseUrl = '/api/i18n';
  const language = 'en';
  const invalidLanguage = 'pt';
  const app = 'survey';

  const url = `${baseUrl}/${language}?app=${app}`;
  const invalidUrl = `${baseUrl}/${invalidLanguage}?app=${app}`;

  it('should return 422 for missing input data', async () => {
    await suite.sharedTests.assertMissingInput('get', `${baseUrl}/${language}`, ['app'], {
      bearer: undefined,
    });
  });

  it(`should return 422 for invalid input data`, async () => {
    const { status, body } = await request(suite.app)
      .get(`${baseUrl}/not-a-locale?app=invalid`)
      .set('Accept', 'application/json');

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys(['app', 'languageId']);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    await suite.sharedTests.assertMissingRecord('get', invalidUrl, undefined, {
      bearer: undefined,
    });
  });

  it('should return 200 and language record', async () => {
    const { status, body } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(200);
    expect(body).toContainAllKeys([
      'id',
      'englishName',
      'localName',
      'countryFlagCode',
      'textDirection',
      'messages',
    ]);
  });

  it('should return 200 and fallback language record', async () => {
    const { status, body } = await request(suite.app)
      .get(`${baseUrl}/en-GB?app=${app}`)
      .set('Accept', 'application/json');

    expect(status).toBe(200);
    expect(body).toContainAllKeys([
      'id',
      'englishName',
      'localName',
      'countryFlagCode',
      'textDirection',
      'messages',
    ]);
  });
};
