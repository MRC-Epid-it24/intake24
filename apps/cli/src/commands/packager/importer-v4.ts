import fs from 'fs/promises';
import path from 'path';

import type { ApiClientV4 } from '@intake24/api-client-v4';
import type { PkgImageMap } from '@intake24/cli/commands/packager/types/image-map';
import { PkgConstants } from '@intake24/cli/commands/packager/constants';
import logger from '@intake24/common-backend/services/logger/logger';

import typeConverters from './types/v4-type-conversions';

export type Logger = typeof logger;

export const conflictResolutionOptions = ['skip', 'overwrite', 'abort'] as const;

export type ConflictResolutionStrategy = (typeof conflictResolutionOptions)[number];

export interface ImporterOptions {
  onConflict?: ConflictResolutionStrategy;
}

const defaultOptions: ImporterOptions = {
  onConflict: 'abort',
};

export class ImporterV4 {
  private readonly inputFilePath: string;
  private readonly workingDir: string;
  private readonly imageDirPath: string;
  private readonly apiClient: ApiClientV4;
  private readonly logger: Logger;
  private readonly options: ImporterOptions;

  constructor(
    apiClient: ApiClientV4,
    logger: Logger,
    inputFilePath: string,
    options?: Partial<ImporterOptions>
  ) {
    this.apiClient = apiClient;
    this.logger = logger;
    this.inputFilePath = inputFilePath;
    this.workingDir = this.inputFilePath;
    this.imageDirPath = path.join(this.workingDir, PkgConstants.IMAGE_DIRECTORY_NAME);
    this.options = {
      onConflict: options?.onConflict ?? defaultOptions.onConflict,
    };
  }

  private async importImageMap(imageMapId: string, imageMap: PkgImageMap): Promise<void> {
    const existing = await this.apiClient.imageMaps.get(imageMapId);

    if (existing !== null) {
      switch (this.options.onConflict) {
        case 'skip':
          logger.info(`Image map already exists, skipping: ${imageMapId}`);
          return Promise.resolve();
        case 'abort': {
          const message = `Image map already exists: ${imageMapId}`;
          logger.error(message);
          return Promise.reject(new Error(message));
        }
        case 'overwrite': {
          logger.info(`Updating existing image map: ${imageMapId}`);
          const objects = typeConverters.fromPackageImageMapObjects(imageMap.objects);

          await this.apiClient.imageMaps.update(imageMapId, imageMap.description, objects);

          await this.apiClient.imageMaps.updateImage(
            imageMapId,
            path.join(this.imageDirPath, imageMap.baseImagePath)
          );

          break;
        }
      }
    } else {
      logger.info(`Creating new image map: ${imageMapId}`);
      const objects = typeConverters.fromPackageImageMapObjects(imageMap.objects);

      await this.apiClient.imageMaps.create(
        imageMapId,
        imageMap.description,
        path.join(this.imageDirPath, imageMap.baseImagePath),
        objects
      );
    }
  }

  private async importImageMaps(): Promise<void> {
    const filePath = path.join(
      this.workingDir,
      PkgConstants.PORTION_SIZE_DIRECTORY_NAME,
      PkgConstants.IMAGE_MAP_FILE_NAME
    );

    const imageMaps = JSON.parse(await fs.readFile(filePath, 'utf-8')) as Record<
      string,
      PkgImageMap
    >;

    logger.info(`Importing ${Object.keys(imageMaps).length} image map(s)`);

    const [imageMapId, imageMap] = Object.entries(imageMaps)[0];

    await this.importImageMap(imageMapId, imageMap);

    /*const createOps = Object.entries(imageMaps).map(([imageMapId, imageMap]) =>
      this.apiClient.imageMaps.create()),
      })
    );

    await Promise.all(createOps);*/
  }

  public async import(): Promise<void> {
    logger.warn(`ON CONFLICT: ${this.options.onConflict}`);

    await this.importImageMaps();
  }
}
