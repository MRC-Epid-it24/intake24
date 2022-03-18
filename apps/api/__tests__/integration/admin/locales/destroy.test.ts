import request from 'supertest';
import { LocaleAttributes } from '@intake24/common/types/models';
import { suite, setPermission } from '@intake24/api-tests/integration/helpers';
import { FoodsLocale, SystemLocale } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/locales';

  let url: string;
  let invalidUrl: string;

  let input: LocaleAttributes;
  let systemLocale: SystemLocale;

  beforeAll(async () => {
    const { id: langId } = suite.data.system.language;
    input = {
      id: 'en-au',
      englishName: 'English - Australia',
      localName: 'English - Australia',
      respondentLanguageId: langId,
      adminLanguageId: langId,
      countryFlagCode: 'en-au',
      prototypeLocaleId: null,
      textDirection: 'ltr',
    };

    await FoodsLocale.create(input);
    systemLocale = await SystemLocale.create(input);

    url = `${baseUrl}/${systemLocale.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('delete', url);
  });

  describe('authenticated / authorized', () => {
    beforeAll(async () => {
      await setPermission('locales|delete');
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('delete', invalidUrl);
    });

    it(`should return 403 - can't delete locale for now`, async () => {
      const { status } = await request(suite.app)
        .delete(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(403);
    });

    /* it('should return 204 and no content', async () => {
      await suite.sharedTests.assertRecordDeleted('delete', url);
    }); */
  });
};
