import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { trim } from 'lodash';

import type {
  PkgGlobalCategory,
  PkgLocalCategory,
} from '@intake24/cli/commands/packager/types/categories';
import type {
  PkgAssociatedFood,
  PkgGlobalFood,
  PkgLocalFood,
  PkgPortionSizeMethod,
} from '@intake24/cli/commands/packager/types/foods';
import type { PkgLocale } from '@intake24/cli/commands/packager/types/locale';
import type { PkgNutrientTable } from '@intake24/cli/commands/packager/types/nutrient-tables';
import { AlbaneAfpRow } from '@intake24/cli/commands/fr-albane/types/afp';
import {
  AlbaneAlternativeDescriptionRow,
} from '@intake24/cli/commands/fr-albane/types/alternative-descriptions';
import { AlbaneFoodCategoryRow } from '@intake24/cli/commands/fr-albane/types/food-categories';
import { AlbaneFoodListRow } from '@intake24/cli/commands/fr-albane/types/food-list';
import { AlbaneInca3MappingRow } from '@intake24/cli/commands/fr-albane/types/inca3-mapping';
import { FrenchLocaleOptions } from '@intake24/cli/commands/fr-inca3/build-fr-locale-command';
import { PackageWriter } from '@intake24/cli/commands/packager/package-writer';
import { capitalize } from '@intake24/common/util';
import logger from '@intake24/common-backend/services/logger/logger';

export type Logger = typeof logger;

const locale: PkgLocale = {
  id: 'fr_albane',
  localName: 'France (Albane)',
  englishName: 'France (Albane)',
  textDirection: 'ltr',
  prototypeLocale: null,
  respondentLanguage: 'fr',
  flagCode: 'fr',
  adminLanguage: 'fr',
  foodIndexLanguageBackendId: 'fr',
};

const dummyNutrientTable: PkgNutrientTable = {
  id: 'FR_TEMP',
  description: 'Placeholder nutrient table',
  csvFieldMapping: [],
  csvNutrientMapping: [],
  csvMapping: {
    idColumnOffset: 0,
    descriptionColumnOffset: 1,
    localDescriptionColumnOffset: 2,
    rowOffset: 1,
  },
  records: [
    {
      name: 'Placeholder record 1',
      recordId: 'FRPH1',
      nutrients: [['1', 100]], // Energy Kcal
      fields: [],
    },
  ],
};

function getIntake24FoodCode(foodCode: string): string {
  return `24F${foodCode}`;
}

export class FrenchAlbaneLocaleBuilder {
  private readonly sourceDirPath: string;
  private readonly outputDirPath: string;
  private readonly logger: Logger;

  private sourceFoodRecords: AlbaneFoodListRow[] | undefined;
  private foodSynonyms: Record<string, string[]> | undefined;
  private foodCategories: Record<string, string[]> | undefined;

  private categoryNames: Record<string, string> | undefined;

  private inca3PortionSizeMapping: Record<string, PkgPortionSizeMethod[]> | undefined;
  private associatedFoodPrompts: Record<string, PkgAssociatedFood[]> | undefined;

  constructor(logger: Logger, options: FrenchLocaleOptions) {
    this.sourceDirPath = options.inputPath;
    this.outputDirPath = options.outputPath;
    this.logger = logger;
  }

  private async readJSON<T>(relativePath: string): Promise<T> {
    const filePath = path.join(this.sourceDirPath, relativePath);
    return JSON.parse(await fs.readFile(filePath, 'utf-8')) as T;
  }

  private async readFoodCategories(): Promise<void> {
    this.foodCategories = {};

    const categoryRecords = await this.readJSON<AlbaneFoodCategoryRow[]>('CATEGORIES_I24_FOOD.json');

    for (const row of categoryRecords) {
      const categoryCodes: string[] = [];

      for (const code of [row.code1, row.code2, row.code3]) {
        if (code === undefined)
          continue;
        const trimmed = trim(code);
        if (trimmed.length > 0)
          categoryCodes.push(trimmed);
      }

      if (categoryCodes.length > 0)
        this.foodCategories[row.A_CODE] = categoryCodes;
    }
  }

  private async readFoodList(): Promise<void> {
    function getSynonyms(row: any, prefix: string): string[] {
      const synonyms: string[] = [];
      for (let i = 1; i <= 14; i++) {
        const synonymValue = row[`${prefix}SYNONYME_${i}`];
        if (typeof (synonymValue) === 'string') {
          const trimmed = trim(synonymValue);
          if (trimmed.length > 0)
            synonyms.push(capitalize(trimmed));
        }
      }
      return synonyms;
    }

    this.sourceFoodRecords = await this.readJSON<AlbaneFoodListRow[]>('FDLIST.json');

    const foodSynonymRecords = await this.readJSON<AlbaneAlternativeDescriptionRow[]>('ALTERNATIVE_FOOD_DESCRIPTION.json');

    this.foodSynonyms = Object.fromEntries(
      foodSynonymRecords.map(r => ([r.A_CODE, getSynonyms(r, 'A_')]) as [string, string[]]).filter(a => a[1].length > 0),
    );
  }

  private buildGlobalFoods(): PkgGlobalFood[] {
    const globalFoods: PkgGlobalFood[] = [];

    for (const row of this.sourceFoodRecords!) {
      const categories = this.foodCategories![row.A_CODE];

      if (!categories)
        logger.warn(`Food ${row.A_CODE} is not assigned to any categories`);

      globalFoods.push({
        version: randomUUID(),
        code: getIntake24FoodCode(row.A_CODE),
        parentCategories: categories ?? [],
        attributes: { sameAsBeforeOption: true },
        groupCode: 1,
        englishDescription: capitalize(row.A_LIBELLE_EN.substring(0, 128)),
      });
    }

    return globalFoods;
  }

  private buildLocalFoods(): PkgLocalFood[] {
    const localFoods: PkgLocalFood[] = [];

    for (const row of this.sourceFoodRecords!) {
      const foodSynonyms = this.foodSynonyms![row.A_CODE];
      const alternativeNames = foodSynonyms === undefined ? undefined : { fr: foodSynonyms.map(s => s.substring(0, 128)) };

      localFoods.push({
        version: randomUUID(),
        code: getIntake24FoodCode(row.A_CODE),
        localDescription: capitalize(row.A_LIBELLE.substring(0, 128)),
        alternativeNames,
        nutrientTableCodes: {
          FR_TEMP: 'FRPH1',
        },
        associatedFoods: this.associatedFoodPrompts![row.A_CODE] ?? [],
        portionSize: this.inca3PortionSizeMapping![row.A_CODE] ?? [],
        brandNames: [],
      });
    }

    return localFoods;
  }

  private buildGlobalCategories(): PkgGlobalCategory[] {
    return [
      {
        code: 'FRPEPO',
        attributes: {},
        englishDescription: 'Baby food and savoury snacks',
        parentCategories: ['19TODSFD'],
        version: '0fd3f027-6f2a-47f3-9838-7bb0037a4fd4',
        isHidden: false,
      },
      {
        code: 'FRDEIN',
        attributes: {},
        englishDescription: 'Baby desserts',
        parentCategories: ['19TODSFD'],
        version: '64f6bd7b-0f0b-41b6-ab20-afac96078a28',
        isHidden: false,
      },
      {
        code: 'FRCEBI',
        attributes: {},
        englishDescription: 'Baby cereals and biscuits',
        parentCategories: ['19TODSFD'],
        version: '7e12b7a1-e7e3-4c57-9f2a-ddf5c1c05f3b',
        isHidden: false,
      },
      {
        code: 'FRLABO',
        attributes: {},
        englishDescription: 'Baby milk and drinks',
        parentCategories: ['19TODSFD'],
        version: '7e12b7a1-e7e3-4c57-9f2a-ddf5c1c05f3b',
        isHidden: false,
      },
      {
        code: 'FRLAMA',
        attributes: {},
        englishDescription: 'Breast milk',
        parentCategories: ['FRLABO'],
        version: 'e309274c-12be-49d0-88e2-26744ce7f3c1',
        isHidden: false,
      },
      {
        code: 'FRCIT',
        attributes: {},
        englishDescription: 'Lemon juice for cooking',
        parentCategories: ['COND'],
        version: '0555155a-8073-4a00-b30c-26691082b7d1',
        isHidden: false,
      },
      {
        code: 'FRHPME',
        attributes: {},
        englishDescription: 'Chili oil',
        parentCategories: ['COND'],
        version: 'eeba6915-790e-42a6-be9d-2fd78ee80567',
        isHidden: false,
      },
    ];
  }

  private buildLocalCategories(): PkgLocalCategory[] {
    const localCategories: PkgLocalCategory[] = [
      {
        code: 'FRPEPO',
        localDescription: 'Petits pots salés & plats infantiles',
        portionSize: [],
      },
      {
        code: 'FRDEIN',
        localDescription: 'Desserts infantiles',
        portionSize: [],
      },
      {
        code: 'FRCEBI',
        localDescription: 'Céréales & biscuits infantiles',
        portionSize: [],
      },
      {
        code: 'FRLABO',
        localDescription: 'Laits & boissons infantiles',
        portionSize: [],
      },
      {
        code: 'FRLAMA',
        localDescription: 'Lait maternel',
        portionSize: [],
      },
      {
        code: 'FRCIT',
        localDescription: 'Jus de citron',
        portionSize: [],
      },
      {
        code: 'FRHPME',
        localDescription: 'Huile pimentée',
        portionSize: [],
      },
    ];

    if (this.categoryNames !== undefined) {
      for (const [code, localDescription] of Object.entries(this.categoryNames)) {
        localCategories.push({
          code,
          localDescription,
          portionSize: [],
        });
      }
    }

    return localCategories;
  }

  private async readInca3Mapping(): Promise<void> {
    const inca3MappingFoodRows
      = (await this.readJSON<AlbaneInca3MappingRow[]>('KEY_INCA3_ALBANE_F.json'))
        .filter(row => row.code_INCA3.length > 0)
        .map(row => ({
          code_ALBANE: row.code_ALBANE,
          code_i24: `23FR${row.code_INCA3}`,
          errorMsg: `Albane food code ${row.code_ALBANE} is mapped to INCA3 food code ${row.code_INCA3}, but it is not in ALIMENTS_FDLIST`,
        }));

    const inca3MappingRecipeRows
      = (await this.readJSON<AlbaneInca3MappingRow[]>('KEY_INCA3_ALBANE_R.json'))
        .filter(row => row.code_INCA3.length > 0)
        .map(row => ({
          code_ALBANE: row.code_ALBANE,
          code_i24: `23FRR${row.code_INCA3}`,
          errorMsg: `Albane food code ${row.code_ALBANE} is mapped to INCA3 recipe code ${row.code_INCA3}, but it is not in RECETTES_RCPLIST`,
        }));

    const inca3MappingRows = [...inca3MappingFoodRows, ...inca3MappingRecipeRows];

    const inca3LocalFoods = await this.readJSON<Record<string, PkgLocalFood[]>>('inca3-local-foods.json');

    this.inca3PortionSizeMapping = {};

    for (const row of inca3MappingRows) {
      const food = inca3LocalFoods.fr_ANSES.find(f => f.code === row.code_i24);

      if (food === undefined)
        logger.warn(row.errorMsg);
      else
        this.inca3PortionSizeMapping[row.code_ALBANE] = food.portionSize;
    }
  }

  private async readAssociatedFoodPrompts(): Promise<void> {
    this.associatedFoodPrompts = {};

    const afpRows = await this.readJSON<AlbaneAfpRow[]>('AFP.json');

    for (let i = 0; i < afpRows.length; i++) {
      const row = afpRows[i];

      const prompts: PkgAssociatedFood[] = [];

      // Just sense checking
      if (row.code.length === 0) {
        logger.warn(`Food code column empty in row ${i + 1} of the associated food prompts file`);
        continue;
      }

      if (row.genericName.length === 0) {
        logger.warn(`Generic name column empty in row ${i + 1} (Albane food code ${row.code}) of the associated food prompts file`);
        continue;
      }

      if (row.categoryCode1.length > 0) {
        if (row.promptText1.length === 0) {
          logger.warn(`Category code defined but prompt text 1 column is empty in row ${i + 1} (Albane food code ${row.code}) of the associated food prompts file`);
          continue;
        }

        prompts.push({
          linkAsMain: false,
          genericName: { fr: row.genericName },
          promptText: { fr: row.promptText1 },
          categoryCode: row.categoryCode1,
        });
      }

      if (row.categoryCode2.length > 0) {
        if (row.promptText2.length === 0) {
          logger.warn(`Category code defined but prompt text 2 column is empty in row ${i + 1} (Albane food code ${row.code}) of the associated food prompts file`);
          continue;
        }

        prompts.push({
          linkAsMain: false,
          genericName: { fr: row.genericName },
          promptText: { fr: row.promptText2 },
          categoryCode: row.categoryCode2,
        });
      }

      if (row.categoryCode3.length > 0) {
        if (row.promptText3.length === 0) {
          logger.warn(`Category code defined but prompt text 3 column is empty in row ${i + 1} (Albane food code ${row.code}) of the associated food prompts file`);
          continue;
        }

        prompts.push({
          linkAsMain: false,
          genericName: { fr: row.genericName },
          promptText: { fr: row.promptText3 },
          categoryCode: row.categoryCode3,
        });
      }

      this.associatedFoodPrompts[row.code] = prompts;
    }
  }

  public async buildPackage(): Promise<void> {
    await this.readFoodList();
    await this.readFoodCategories();
    await this.readInca3Mapping();
    await this.readAssociatedFoodPrompts();

    const globalFoods = this.buildGlobalFoods();
    const localFoods = this.buildLocalFoods();

    const globalCategories = this.buildGlobalCategories();
    const localCategories = this.buildLocalCategories();

    const localCategoriesRecord = {
      [locale.id]: localCategories,
    };

    const localFoodsRecord = {
      [locale.id]: localFoods,
    };

    const enabledLocalFoods = {
      [locale.id]: localFoods.map(f => f.code),
    };

    const writer = new PackageWriter(this.logger, this.outputDirPath);

    await writer.writeLocales([locale]);
    await writer.writeGlobalFoods(globalFoods);
    await writer.writeLocalFoods(localFoodsRecord);
    await writer.writeGlobalCategories(globalCategories);
    await writer.writeLocalCategories(localCategoriesRecord);
    await writer.writeEnabledLocalFoods(enabledLocalFoods);
    await writer.writeNutrientTables([dummyNutrientTable]);
  }
}
