import fs from 'fs/promises';
import { keyBy } from 'lodash';
import path from 'path';
import { v4 as randomUUID } from 'uuid';

import type { FrenchLocaleOptions } from '@intake24/cli/commands/fr-inca3/build-fr-locale-command';
import type {
  INCA3EnglishDescription,
  INCA3FoodListRow,
} from '@intake24/cli/commands/fr-inca3/types/food-list';
import type { PkgGlobalFood, PkgLocalFood } from '@intake24/cli/commands/packager/types/foods';
import type { PkgLocale } from '@intake24/cli/commands/packager/types/locale';
import type logger from '@intake24/common-backend/services/logger/logger';
import { PackageWriter } from '@intake24/cli/commands/packager/package-writer';
import { capitalize } from '@intake24/common/util';

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
  private englishDescriptions: Record<string, string> | undefined;

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

  private async buildLocalFoods(): Promise<PkgLocalFood[]> {
    const localFoods: PkgLocalFood[] = this.sourceFoodRecords!.map((row) => ({
      version: randomUUID(),
      code: getIntake24Code(row.A_CODE),
      localDescription: capitalize(row.A_LIBELLE),
      nutrientTableCodes: {},
      associatedFoods: [],
      portionSize: [],
      brandNames: [],
    }));

    return localFoods;
  }

  public async buildPackage(): Promise<void> {
    await this.readFoodList();

    const globalFoods = await this.buildGlobalFoods();
    const localFoods = await this.buildLocalFoods();

    const localFoodsRecord = {
      [locale.id]: localFoods,
    };

    const enabledLocalFoods = {
      [locale.id]: localFoods.map((f) => f.code),
    };

    const writer = new PackageWriter(this.logger, this.outputDirPath);

    await writer.writeLocales([locale]);
    await writer.writeGlobalFoods(globalFoods);
    await writer.writeLocalFoods(localFoodsRecord);
    await writer.writeEnabledLocalFoods(enabledLocalFoods);
  }
}
