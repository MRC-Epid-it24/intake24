// This has to be done first because the database config is pulled indirectly by services, doing
// it during initDatabases is too late and moving helpers/databases import higher interferes with
// ESLint import ordering rules
import '../../bootstrap';

import { FoodDataService, foodDataService } from '@/services';
import { Locale } from '@/db/models/foods';
import { DbInterface } from '@/db';
import InvalidIdError from '@/services/foods/invalid-id-error';
import { initDatabases, releaseDatabases } from '../helpers/databases';

async function createLocales(): Promise<void> {
  const base = new Locale({
    adminLanguageId: 'en',
    countryFlagCode: 'gb',
    englishName: 'United Kingdom',
    id: 'en_GB',
    localName: 'United Kingdom',
    prototypeLocaleId: undefined,
    respondentLanguageId: 'en',
    textDirection: 'ltr',
  });

  await base.save();

  const derived = new Locale({
    adminLanguageId: 'en',
    countryFlagCode: 'au',
    englishName: 'Australia',
    id: 'en_AU',
    localName: 'Australia',
    prototypeLocaleId: 'en_GB',
    respondentLanguageId: 'en',
    textDirection: 'ltr',
  });

  await derived.save();
}

describe('Food data service', () => {
  let databases: DbInterface;
  let service: FoodDataService;

  beforeAll(async () => {
    databases = await initDatabases();
    await createLocales();
    service = foodDataService();
  });

  afterAll(async () => {
    await releaseDatabases();
  });

  describe('getParentLocale', () => {
    it('should throw InvalidIdError for unknown locales', () => {
      const parent = service.getParentLocale('bad_locale');
      expect(parent).rejects.toThrow(InvalidIdError);
    });

    it('should return null for locales without a parent locale', async () => {
      const parent = await service.getParentLocale('en_GB');
      expect(parent).toBe(null);
    });

    it('should return correct parent locale for locales that have it', async () => {
      const parent = await service.getParentLocale('en_AU');
      expect(parent?.id).toBe('en_GB');
    });
  });
});
