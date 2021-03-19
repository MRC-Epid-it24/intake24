// This has to be done first because the database config is pulled indirectly by services, doing
// it during initDatabases is too late and moving helpers/databases import higher interferes with
// ESLint import ordering rules
import '../../bootstrap';

import { FoodDataService, foodDataService } from '@/services';
import {
  Food,
  FoodLocal,
  Locale,
  NutrientMapping,
  NutrientTable,
  NutrientTableRecord,
  NutrientTableRecordNutrient,
  NutrientType,
  NutrientUnit,
} from '@/db/models/foods';
import { DbInterface } from '@/db';
import InvalidArgumentError from '@/services/foods/invalid-argument-error';
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

async function createNutrientTables(): Promise<void> {
  const unit = new NutrientUnit({
    id: 1,
    description: 'Test unit',
    symbol: 'tu',
  });

  await unit.save();

  const nutrientTypeKcal = new NutrientType({
    id: 1,
    description: 'Energy (kcal)',
    unitId: 1,
  });

  await nutrientTypeKcal.save();

  const table = new NutrientTable(
    {
      id: 'TEST',
      description: 'Test nutrient table',
      records: [
        {
          id: 1,
          nutrientTableRecordId: 'TN1',
          name: 'Food A',
          localName: 'Food A',
          nutrients: {
            nutrientTypeId: 1,
            unitsPer100g: 100,
          },
        },
      ],
    },
    {
      include: [
        {
          model: NutrientTableRecord,
          include: [NutrientTableRecordNutrient],
        },
      ],
    }
  );

  await table.save();
}

async function createFoods() {
  const food = new Food({
    code: 'TF1',
    description: 'Test food 1',
    foodGroupId: 1,
    version: '00000000-0000-0000-0000-000000000000',
  });

  await food.save();

  const local = new FoodLocal(
    {
      foodCode: 'TF1',
      localeId: 'en_GB',
      name: 'Test food 1',
      simpleName: 'Test food 1',
      version: '00000000-0000-0000-0000-000000000000',
      nutrientMappings: [
        {
          nutrientTableRecordId: 1,
        },
      ],
    },
    {
      include: [NutrientMapping],
    }
  );

  await local.save();
}

describe('Food data service', () => {
  let databases: DbInterface;
  let service: FoodDataService;

  beforeAll(async () => {
    databases = await initDatabases();
    await createLocales();
    await createNutrientTables();
    await createFoods();
    service = foodDataService();
  });

  afterAll(async () => {
    await releaseDatabases();
  });

  describe('getParentLocale', () => {
    it('should throw InvalidArgumentError for unknown locales', async () => {
      const parent = service.getParentLocale('bad_locale');
      await expect(parent).rejects.toThrow(InvalidArgumentError);
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

  describe('getNutrientKCalPer100G', () => {
    it('should throw InvalidArgumentError for unknown food IDs', async () => {
      const promise = service.getNutrientKCalPer100G('en_GB', 'BAD_FOOD');
      await expect(promise).rejects.toThrow(InvalidArgumentError);
    });

    it('should throw InvalidArgumentError for unknown locale IDs', async () => {
      const promise = service.getNutrientKCalPer100G('bad_locale', 'TEST1');
      await expect(promise).rejects.toThrow(InvalidArgumentError);
    });

    it('should return correct kcal value for valid food and locale IDs', async () => {
      const kcal = await service.getNutrientKCalPer100G('en_GB', 'TF1');
      expect(kcal).toBe(100);
    });
  });
});
