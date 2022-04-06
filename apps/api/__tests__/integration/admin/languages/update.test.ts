import { pick } from 'lodash';
import request from 'supertest';
import { LanguageCreationAttributes } from '@intake24/common/types/models';
import { suite } from '@intake24/api-tests/integration/helpers';
import { Language } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/languages';
  const permissions = ['languages', 'languages|edit'];

  let url: string;
  let invalidUrl: string;

  let input: LanguageCreationAttributes;
  let updateInput: LanguageCreationAttributes;
  let output: LanguageCreationAttributes;
  let language: Language;

  beforeAll(async () => {
    input = {
      id: 'es-ec',
      englishName: 'Spanish - Ecuador',
      localName: 'Spanish - Ecuador',
      countryFlagCode: 'es-ec',
      textDirection: 'ltr',
    };
    updateInput = {
      id: 'es-sv',
      englishName: 'Spanish - El Salvador',
      localName: 'Spanish - El Salvador',
      countryFlagCode: 'es-sv',
      textDirection: 'ltr',
    };

    const { id } = input;
    output = { ...updateInput, id };

    language = await Language.create(input);

    url = `${baseUrl}/${language.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('put', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertMissingInput('put', url, [
        'englishName',
        'localName',
        'countryFlagCode',
        'textDirection',
      ]);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          englishName: { name: 'United Kingdom' },
          localName: ['United Kingdom'],
          countryFlagCode: false,
          textDirection: 'wrongDirection',
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys([
        'englishName',
        'localName',
        'countryFlagCode',
        'textDirection',
      ]);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('put', invalidUrl, updateInput);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(200);
      expect(pick(body, Object.keys(output))).toEqual(output);
    });
  });
};
