import { pick } from 'lodash';
import request from 'supertest';
import { LocaleAttributes } from '@intake24/common/types/models';
import { suite } from '@intake24/api-tests/integration/helpers';
import { FoodsLocale, SystemLocale } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/locales';
  const permissions = ['locales', 'locales|edit'];

  let url: string;
  let invalidUrl: string;

  let input: LocaleAttributes;
  let output: LocaleAttributes;
  let systemLocale: SystemLocale;

  beforeAll(async () => {
    const { id: langId } = suite.data.system.language;
    input = {
      id: 'en-ca',
      englishName: 'English - Canada',
      localName: 'English - Canada',
      respondentLanguageId: langId,
      adminLanguageId: langId,
      countryFlagCode: 'en-ca',
      prototypeLocaleId: null,
      textDirection: 'ltr',
    };

    await FoodsLocale.create(input);
    systemLocale = await SystemLocale.create(input);

    output = { ...input };

    url = `${baseUrl}/${systemLocale.id}/edit`;
    invalidUrl = `${baseUrl}/999999/edit`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('get', invalidUrl);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(200);
      expect(pick(body, Object.keys(output))).toEqual(output);
    });
  });
};
