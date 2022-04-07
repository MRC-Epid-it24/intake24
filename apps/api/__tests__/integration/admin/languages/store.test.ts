import request from 'supertest';
import { LanguageCreationAttributes } from '@intake24/common/types/models';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/languages';
  const permissions = ['languages', 'languages|create'];

  let input: LanguageCreationAttributes;
  let output: LanguageCreationAttributes;

  beforeAll(async () => {
    input = {
      id: 'es-cr',
      englishName: 'Spanish - Costa Rica',
      localName: 'Spanish - Costa Rica',
      countryFlagCode: 'es-cr',
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
          englishName: { key: 'name' },
          localName: ['dddsds', 'dffd'],
          countryFlagCode: 10,
          textDirection: 'wrongDirection',
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys([
        'id',
        'englishName',
        'localName',
        'countryFlagCode',
        'textDirection',
      ]);
    });

    it('should return 201 and new resource', async () => {
      await suite.sharedTests.assertRecordInserted('post', url, output, { input });
    });

    it('should return 422 for duplicate id', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          id: input.id,
          englishName: 'Spanish - Dominican Republic',
          localName: 'Spanish - Dominican Republic',
          countryFlagCode: 'es-do',
          textDirection: 'ltr',
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['id']);
    });
  });
};
