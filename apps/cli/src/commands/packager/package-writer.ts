import fs from 'node:fs/promises';
import path from 'node:path';

import { merge } from 'lodash';

import { PkgConstants } from '@intake24/cli/commands/packager/constants';
import type { PkgAsServedSet } from '@intake24/cli/commands/packager/types/as-served';
import type {
  PkgGlobalCategory,
  PkgLocalCategory,
} from '@intake24/cli/commands/packager/types/categories';
import type { PkgDrinkwareSet } from '@intake24/cli/commands/packager/types/drinkware';
import type { PkgGlobalFood, PkgLocalFood } from '@intake24/cli/commands/packager/types/foods';
import type { PkgGuideImage } from '@intake24/cli/commands/packager/types/guide-image';
import type { PkgImageMap } from '@intake24/cli/commands/packager/types/image-map';
import type { PkgLocale } from '@intake24/cli/commands/packager/types/locale';
import type { PkgNutrientTable } from '@intake24/cli/commands/packager/types/nutrient-tables';
import type logger from '@intake24/common-backend/services/logger/logger';

export type Logger = typeof logger;

export interface PackageWriterOptions {
  jsonSpaces: number;
  outputEncoding: BufferEncoding;
}

const defaultOptions: PackageWriterOptions = {
  jsonSpaces: 2,
  outputEncoding: 'utf-8',
};

export interface PackageInfo {
  version: string;
  date: string;
}

export class PackageWriter {
  private static readonly version = '1.4';

  private readonly outputDir: string;
  private readonly options: PackageWriterOptions;
  private readonly logger: Logger;

  private async writeJSON(object: any, outputPath: string): Promise<void> {
    const dirName = path.dirname(outputPath);
    await fs.mkdir(dirName, { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(object, null, this.options.jsonSpaces), {
      encoding: this.options.outputEncoding,
    });
  }

  private async appendJSON(
    newRecords: Record<string, any>,
    filePath: string,
    overwrite: boolean = false,
  ): Promise<void> {
    // Not great since this introduces a race condition
    try {
      await fs.access(filePath, fs.constants.F_OK);

      const records = JSON.parse(await fs.readFile(filePath, 'utf-8')) as Record<string, any>;

      for (const [id, record] of Object.entries(newRecords)) {
        if (!overwrite && id in records)
          throw new Error(`Record ${id} already exists in destination package file ${filePath}`);

        records[id] = record;
      }

      await this.writeJSON(records, filePath);
    }
    catch {
      await this.writeJSON(newRecords, filePath);
    }
  }

  public async writeGlobalFoods(globalFoods: PkgGlobalFood[]) {
    await this.writeJSON(
      globalFoods,
      path.join(this.outputDir, PkgConstants.GLOBAL_FOODS_FILE_NAME),
    );
  }

  public async writeGlobalCategories(globalCategories: PkgGlobalCategory[]) {
    await this.writeJSON(
      globalCategories,
      path.join(this.outputDir, PkgConstants.GLOBAL_CATEGORIES_FILE_NAME),
    );
  }

  public async writeLocales(locales: PkgLocale[]) {
    await this.writeJSON(locales, path.join(this.outputDir, PkgConstants.LOCALES_FILE_NAME));
  }

  public async writeLocalFoods(localFoods: Record<string, PkgLocalFood[]>) {
    await this.writeJSON(localFoods, path.join(this.outputDir, PkgConstants.LOCAL_FOODS_FILE_NAME));
  }

  public async writeLocalCategories(localCategories: Record<string, PkgLocalCategory[]>) {
    await this.writeJSON(
      localCategories,
      path.join(this.outputDir, PkgConstants.LOCAL_CATEGORIES_FILE_NAME),
    );
  }

  public async writeEnabledLocalFoods(enabledFoods: Record<string, string[]>) {
    await this.writeJSON(
      enabledFoods,
      path.join(this.outputDir, PkgConstants.ENABLED_LOCAL_FOODS_FILE_NAME),
    );
  }

  public async writeDrinkwareSets(drinkwareSets: Record<string, PkgDrinkwareSet>) {
    await this.writeJSON(
      drinkwareSets,
      path.join(
        this.outputDir,
        PkgConstants.PORTION_SIZE_DIRECTORY_NAME,
        PkgConstants.DRINKWARE_FILE_NAME,
      ),
    );
  }

  public async appendDrinkwareSets(
    newDrinkwareSets: Record<string, PkgDrinkwareSet>,
    _overwrite: boolean = false,
  ) {
    await this.appendJSON(
      newDrinkwareSets,
      path.join(
        this.outputDir,
        PkgConstants.PORTION_SIZE_DIRECTORY_NAME,
        PkgConstants.DRINKWARE_FILE_NAME,
      ),
    );
  }

  public async writeGuideImages(guideImages: Record<string, PkgGuideImage>) {
    await this.writeJSON(
      guideImages,
      path.join(
        this.outputDir,
        PkgConstants.PORTION_SIZE_DIRECTORY_NAME,
        PkgConstants.GUIDE_IMAGE_FILE_NAME,
      ),
    );
  }

  public async writeImageMaps(imageMaps: Record<string, PkgImageMap>) {
    await this.writeJSON(
      imageMaps,
      path.join(
        this.outputDir,
        PkgConstants.PORTION_SIZE_DIRECTORY_NAME,
        PkgConstants.IMAGE_MAP_FILE_NAME,
      ),
    );
  }

  public async appendImageMaps(imageMaps: Record<string, PkgImageMap>) {
    await this.appendJSON(
      imageMaps,
      path.join(
        this.outputDir,
        PkgConstants.PORTION_SIZE_DIRECTORY_NAME,
        PkgConstants.IMAGE_MAP_FILE_NAME,
      ),
    );
  }

  public async writeAsServedSets(asServedSets: PkgAsServedSet[]) {
    await this.writeJSON(
      asServedSets,
      path.join(
        this.outputDir,
        PkgConstants.PORTION_SIZE_DIRECTORY_NAME,
        PkgConstants.AS_SERVED_FILE_NAME,
      ),
    );
  }

  public async writeNutrientTables(nutrientTables: PkgNutrientTable[]) {
    await this.writeJSON(
      nutrientTables,
      path.join(this.outputDir, PkgConstants.NUTRIENT_TABLES_FILE_NAME),
    );
  }

  public async writePackageInfo() {
    await this.writeJSON(
      {
        version: PackageWriter.version,
        date: new Date().toISOString(),
      },
      path.join(this.outputDir, PkgConstants.PACKAGE_INFO_FILE_NAME),
    );
  }

  constructor(logger: Logger, outputDir: string, options?: Partial<PackageWriterOptions>) {
    this.logger = logger;
    this.outputDir = outputDir;
    this.options = merge(defaultOptions, options);
  }
}
