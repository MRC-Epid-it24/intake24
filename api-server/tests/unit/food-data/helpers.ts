import { FoodDataService } from '@/services';
import { DbInterface } from '@/db';
import InvalidIdError from '@/services/foods/invalid-id-error';
import { getParentLocale } from '@/services/foods/common';

import { initDatabases, releaseDatabases } from '../helpers/databases';
import createLocales from './test-data-locales';

export default () => {
  describe('Helpers', () => {
    let databases: DbInterface;
    let service: FoodDataService;

    beforeAll(async () => {
      databases = await initDatabases();
      await createLocales();
    });

    afterAll(async () => {
      await releaseDatabases();
    });

    describe('getParentLocale', () => {
      it('should throw InvalidIdError for unknown locales', async () => {
        const parent = getParentLocale('bad_locale');
        await expect(parent).rejects.toThrow(InvalidIdError);
      });

      it('should return null for locales without a parent locale', async () => {
        const parent = await getParentLocale('en_GB');
        expect(parent).toBe(null);
      });

      it('should return correct parent locale for locales that have it', async () => {
        const parent = await getParentLocale('en_AU');
        expect(parent?.id).toBe('en_GB');
      });
    });
  });
};
