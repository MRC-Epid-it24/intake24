import request from 'supertest';
import { LocaleAttributes } from '@intake24/common/types/models';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/locales';
  const permissions = ['locales', 'locales|create'];

  let input: LocaleAttributes;
  let output: LocaleAttributes;

  beforeAll(async () => {
    const { id: langId } = suite.data.system.language;
    input = {
      id: 'en-cb',
      englishName: 'English - Caribbean',
      localName: 'English - Caribbean',
      respondentLanguageId: langId,
      adminLanguageId: langId,
      countryFlagCode: 'en-cb',
      prototypeLocaleId: null,
      textDirection: 'ltr',
    };
    output = { ...input };
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertMissingInput('post', url, [
        'id',
        'englishName',
        'localName',
        'respondentLanguageId',
        'adminLanguageId',
        'countryFlagCode',
        'textDirection',
      ]);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          id: null,
          englishName: [],
          localName: ['dddsds', 'dffd'],
          respondentLanguageId: 'nonLocaleString',
          adminLanguageId: 5,
          countryFlagCode: 5,
          prototypeLocaleId: 'nonExistingLocale',
          textDirection: 'wrongDirection',
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys([
        'id',
        'englishName',
        'localName',
        'respondentLanguageId',
        'adminLanguageId',
        'countryFlagCode',
        'prototypeLocaleId',
        'textDirection',
      ]);
    });

    it('should return 201 and new resource', async () => {
      await suite.sharedTests.assertRecordInserted('post', url, output, { input });
    });

    it('should return 422 for duplicate id', async () => {
      const { id: langId } = suite.data.system.language;

      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          id: input.id,
          englishName: 'English - India',
          localName: 'English - India',
          respondentLanguageId: langId,
          adminLanguageId: langId,
          countryFlagCode: 'en-in',
          prototypeLocaleId: null,
          textDirection: 'ltr',
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['id']);
    });
  });
};
