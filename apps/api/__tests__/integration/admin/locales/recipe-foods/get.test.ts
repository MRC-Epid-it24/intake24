import type { LocaleRecipeFoodsInput } from '@intake24/common/types/http/admin';
import ioc from '@intake24/api/ioc';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const baseUrl = '/api/admin/locales';
  const permissions = ['locales', 'locales|recipe-foods'];

  let url: string;
  let invalidUrl: string;

  let recipeFoods: LocaleRecipeFoodsInput[];

  beforeAll(async () => {
    const { id, code: localeId } = suite.data.system.locale;

    recipeFoods = [
      {
        localeId: localeId,
        code: 'RF-TST-1',
        name: 'recipe-food-test1',
        recipeWord: 'test-food-1',
        synonyms_id: null,
      },
      {
        localeId: localeId,
        code: 'RF-TST-2',
        name: 'recipe-food-test2',
        recipeWord: 'test-food-2',
        synonyms_id: null,
      },
    ];

    await ioc.cradle.localeService.setRecipeFoods(localeId, recipeFoods);

    url = `${baseUrl}/${id}/recipe-foods`;
    invalidUrl = `${baseUrl}/999999/recipe-foods`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url, { permissions });
  });

  // describe('authenticated / resource authorized', () => {
  //   beforeAll(async () => {
  //     await suite.util.setPermission(permissions);
  //   });

  //   it(`should return 404 when record doesn't exist`, async () => {
  //     await suite.sharedTests.assertMissingRecord('get', invalidUrl);
  //   });

  //   it('should return 200 and records', async () => {
  //     await suite.util.setPermission(permissions);

  //     const { status, body } = await request(suite.app)
  //       .get(url)
  //       .set('Accept', 'application/json')
  //       .set('Authorization', suite.bearer.user)
  //       .send();

  //     expect(status).toBe(200);
  //     expect(body).toBeArray();

  //     const lists = body.map(({ id, ...rest }: LocaleRecipeFoodsInput) => rest);
  //     expect(lists).toIncludeSameMembers(recipeFoods);
  //   });
  // });
};
