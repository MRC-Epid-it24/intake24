import fs from 'fs/promises';
import { groupBy, mapValues } from 'lodash';
import path from 'path';
import { v4 as randomUUID } from 'uuid';

import type { FrenchLocaleOptions } from '@intake24/cli/commands/fr-inca3/build-fr-locale-command';
import type {
  INCA3EnglishDescription,
  INCA3FoodListRow,
} from '@intake24/cli/commands/fr-inca3/types/food-list';
import type { INCA3FoodQuantRow } from '@intake24/cli/commands/fr-inca3/types/food-quant';
import type { INCA3PortionSizeImage } from '@intake24/cli/commands/fr-inca3/types/portion-size-images';
import type { PkgAsServedSet } from '@intake24/cli/commands/packager/types/as-served';
import type {
  PkgAsServedPsm,
  PkgGlobalFood,
  PkgLocalFood,
  PkgPortionSizeMethod,
} from '@intake24/cli/commands/packager/types/foods';
import type { PkgLocale } from '@intake24/cli/commands/packager/types/locale';
import type { PkgNutrientTable } from '@intake24/cli/commands/packager/types/nutrient-tables';
import { PackageWriter } from '@intake24/cli/commands/packager/package-writer';
import { capitalize } from '@intake24/common/util';
import logger from '@intake24/common-backend/services/logger/logger';

export type Logger = typeof logger;

const locale: PkgLocale = {
  id: 'fr_ANSES',
  localName: 'France (ANSES)',
  englishName: 'France (ANSES)',
  textDirection: 'ltr',
  prototypeLocale: null,
  respondentLanguage: 'fr',
  flagCode: 'fr',
  adminLanguage: 'fr',
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

function isFoodCode(code: string): boolean {
  return !code.includes('-');
}

function getIntake24Code(foodCode: string): string {
  return `23FR${foodCode}`;
}

export class FrenchAnsesLocaleBuilder {
  private readonly sourceDirPath: string;
  private readonly outputDirPath: string;
  private readonly logger: Logger;

  private sourceRecords: INCA3FoodListRow[] | undefined;
  private sourceFoodRecords: INCA3FoodListRow[] | undefined;
  private portionSizeRecords: Record<string, INCA3FoodQuantRow> | undefined;
  private englishDescriptions: Record<string, string> | undefined;
  private portionSizeImages: INCA3PortionSizeImage[] | undefined;

  constructor(logger: Logger, options: FrenchLocaleOptions) {
    this.sourceDirPath = options.inputPath;
    this.outputDirPath = options.outputPath;
    this.logger = logger;
  }

  private async readJSON<T>(relativePath: string): Promise<T> {
    const filePath = path.join(this.sourceDirPath, relativePath);
    return JSON.parse(await fs.readFile(filePath, 'utf-8')) as T;
  }

  private getIntake24Categories(
    gpe: string,
    sgpe: string | undefined,
    ssgpe: string | undefined
  ): string[] {
    return [];
  }

  private getEnglishDescription(code: string): string {
    const description = this.englishDescriptions![code];

    if (description === undefined) {
      throw new Error(`Missing English description for food ${code}`);
    }

    return description;
  }

  private async readFoodList(): Promise<void> {
    this.sourceRecords = await this.readJSON<INCA3FoodListRow[]>('ALIMENTS_FDLIST.json');
    this.sourceFoodRecords = this.sourceRecords.filter((record) => isFoodCode(record.A_CODE));

    const englishDescriptionRecords =
      await this.readJSON<INCA3EnglishDescription[]>('EN_DESC.json');

    this.englishDescriptions = Object.fromEntries(
      englishDescriptionRecords.map((r) => [r.code, r.englishDescription])
    );

    const fdQuantRows = await this.readJSON<INCA3FoodQuantRow[]>('ALIMENTS_FDQUANT.json');

    this.portionSizeRecords = Object.fromEntries(fdQuantRows.map((row) => [row.A_CODE, row]));
  }

  private async readPortionSizeImages(): Promise<void> {
    this.portionSizeImages = await this.readJSON<INCA3PortionSizeImage[]>(
      path.join('portion-size', 'images.json')
    );
  }

  private async buildGlobalFoods(): Promise<PkgGlobalFood[]> {
    const globalFoods: PkgGlobalFood[] = this.sourceFoodRecords!.map((row) => ({
      version: randomUUID(),
      code: getIntake24Code(row.A_CODE),
      parentCategories: this.getIntake24Categories(row.A_GPE, row.A_SGPE, row.AS_SSGPE),
      attributes: {},
      groupCode: 1,
      englishDescription: capitalize(this.getEnglishDescription(row.A_CODE)),
    }));

    return globalFoods;
  }

  private getPortionSizeMethods(foodCode: string): PkgPortionSizeMethod[] {
    if (this.portionSizeRecords === undefined) {
      throw new Error('Portion size data not loaded');
    }

    const portionSizeMethods: PkgPortionSizeMethod[] = [];

    const portionSizeRow = this.portionSizeRecords[foodCode];

    if (portionSizeRow !== undefined) {
      if (portionSizeRow.LISTE_PHOTOS !== undefined && portionSizeRow.LISTE_PHOTOS.length > 0) {
        portionSizeRow.LISTE_PHOTOS.trim()
          .split(',')
          .forEach((pictureId) => {
            portionSizeMethods.push({
              method: 'as-served',
              description: 'use_an_image',
              useForRecipes: true,
              conversionFactor: 1.0,
              servingImageSet: `INCA3_${pictureId.padStart(3, '0')}`,
            });
          });
      }
    } else {
      logger.warn(`Food ${foodCode} has no corresponding record in the ALIMENTS_FDQUANT table`);
    }

    if (portionSizeMethods.length === 0) {
      // Temporary fallback method, shouldn't be there in the final version

      portionSizeMethods.push({
        method: 'standard-portion',
        description: 'use_a_standard_portion',
        useForRecipes: true,
        conversionFactor: 1.0,
        units: [
          {
            name: 'pieces',
            omitFoodDescription: false,
            weight: 100,
          },
        ],
      });
    }

    return portionSizeMethods;
  }

  private async buildLocalFoods(): Promise<PkgLocalFood[]> {
    const localFoods: PkgLocalFood[] = this.sourceFoodRecords!.map((row) => ({
      version: randomUUID(),
      code: getIntake24Code(row.A_CODE),
      localDescription: capitalize(row.A_LIBELLE),
      nutrientTableCodes: {
        FR_TEMP: 'FRPH1',
      },
      associatedFoods: [],
      portionSize: this.getPortionSizeMethods(row.A_CODE),
      brandNames: [],
    }));

    return localFoods;
  }

  private buildAsServed(): PkgAsServedSet[] {
    const imagesById = groupBy(this.portionSizeImages, (record) => record.pictureId);

    return Object.entries(imagesById).map(([imageId, images]) => {
      return {
        id: `INCA3_${imageId}`,
        description: images[0].name,
        selectionImagePath: '',
        images: images.map((image) => ({
          imagePath: `INCA3/${image.fileName}`,
          weight: parseFloat(image.weight),
          imageKeywords: [],
        })),
      };
    });
  }

  public async buildPackage(): Promise<void> {
    await this.readFoodList();
    await this.readPortionSizeImages();

    const globalFoods = await this.buildGlobalFoods();
    const localFoods = await this.buildLocalFoods();

    const localFoodsRecord = {
      [locale.id]: localFoods,
    };

    const enabledLocalFoods = {
      [locale.id]: localFoods.map((f) => f.code),
    };

    const asServedSets = this.buildAsServed();

    const writer = new PackageWriter(this.logger, this.outputDirPath);

    await writer.writeLocales([locale]);
    await writer.writeGlobalFoods(globalFoods);
    await writer.writeLocalFoods(localFoodsRecord);
    await writer.writeEnabledLocalFoods(enabledLocalFoods);
    await writer.writeNutrientTables([dummyNutrientTable]);
    await writer.writeAsServedSets(asServedSets);
  }
}
