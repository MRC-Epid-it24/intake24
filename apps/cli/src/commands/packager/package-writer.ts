import fs from 'fs/promises';
import { keys, merge, sortBy, uniqBy, zip } from 'lodash';
import path from 'path';

import type { ApiClientV3 } from '@intake24/api-client-v3';
import type { PkgAsServedSet } from '@intake24/cli/commands/packager/types/as-served';
import type { PkgDrinkwareSet } from '@intake24/cli/commands/packager/types/drinkware';
import type { PkgGlobalFood, PkgLocalFood } from '@intake24/cli/commands/packager/types/foods';
import type { PkgGuideImage } from '@intake24/cli/commands/packager/types/guide-image';
import type { PkgImageMap } from '@intake24/cli/commands/packager/types/image-map';
import type { PkgLocale } from '@intake24/cli/commands/packager/types/locale';
import type logger from '@intake24/common-backend/services/logger/logger';
import { PkgConstants } from '@intake24/cli/commands/packager/constants';
import typeConverters from '@intake24/cli/commands/packager/types/v3-type-conversions';

export type Logger = typeof logger;

export interface PackageWriterOptions {
  jsonSpaces: number;
  outputEncoding: BufferEncoding;
}

const defaultOptions: PackageWriterOptions = {
  jsonSpaces: 2,
  outputEncoding: 'utf-8',
};

interface LocaleData {
  properties: PkgLocale;
  localFoods: PkgLocalFood[];
  enabledLocalFoods: string[];
  globalFoods: PkgGlobalFood[];
}

interface FoodData {
  localFood: PkgLocalFood;
  globalFood: PkgGlobalFood;
}

export class PackageWriter {
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

  public async writeGlobalFoods(globalFoods: PkgGlobalFood[]) {
    await this.writeJSON(
      globalFoods,
      path.join(this.outputDir, PkgConstants.GLOBAL_FOODS_FILE_NAME)
    );
  }

  public async writeLocales(locales: PkgLocale[]) {
    await this.writeJSON(locales, path.join(this.outputDir, PkgConstants.LOCALES_FILE_NAME));
  }

  public async writeLocalFoods(localFoods: Record<string, PkgLocalFood[]>) {
    await this.writeJSON(localFoods, path.join(this.outputDir, PkgConstants.LOCAL_FOODS_FILE_NAME));
  }

  public async writeEnabledLocalFoods(enabledFoods: Record<string, string[]>) {
    await this.writeJSON(
      enabledFoods,
      path.join(this.outputDir, PkgConstants.ENABLED_LOCAL_FOODS_FILE_NAME)
    );
  }

  public async writeDrinkwareSets(drinkwareSets: Record<string, PkgDrinkwareSet>) {
    await this.writeJSON(
      drinkwareSets,
      path.join(
        this.outputDir,
        PkgConstants.PORTION_SIZE_DIRECTORY_NAME,
        PkgConstants.DRINKWARE_FILE_NAME
      )
    );
  }

  public async writeGuideImages(guideImages: Record<string, PkgGuideImage>) {
    await this.writeJSON(
      guideImages,
      path.join(
        this.outputDir,
        PkgConstants.PORTION_SIZE_DIRECTORY_NAME,
        PkgConstants.GUIDE_IMAGE_FILE_NAME
      )
    );
  }

  public async writeImageMaps(guideImages: Record<string, PkgImageMap>) {
    await this.writeJSON(
      guideImages,
      path.join(
        this.outputDir,
        PkgConstants.PORTION_SIZE_DIRECTORY_NAME,
        PkgConstants.IMAGE_MAP_FILE_NAME
      )
    );
  }

  public async writeAsServedSets(asServedSets: Record<string, PkgAsServedSet>) {
    await this.writeJSON(
      asServedSets,
      path.join(
        this.outputDir,
        PkgConstants.PORTION_SIZE_DIRECTORY_NAME,
        PkgConstants.AS_SERVED_FILE_NAME
      )
    );
  }

  constructor(logger: Logger, outputDir: string, options?: Partial<PackageWriterOptions>) {
    this.logger = logger;
    this.outputDir = outputDir;
    this.options = merge(defaultOptions, options);
  }
}
