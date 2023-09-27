import fs from 'fs/promises';
import path from 'path';

import type { ApiClientV4 } from '@intake24/api-client-v4';
import type { PkgImageMap } from '@intake24/cli/commands/packager/types/image-map';
import { PkgConstants } from '@intake24/cli/commands/packager/constants';
import { imageMap } from '@intake24/common/prompts';
import logger from '@intake24/common-backend/services/logger/logger';

export type Logger = typeof logger;

export interface ImporterOptions {}

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
      ...options,
    };
  }

  private async createImageMaps(): Promise<void> {
    const filePath = path.join(
      this.workingDir,
      PkgConstants.PORTION_SIZE_DIRECTORY_NAME,
      PkgConstants.IMAGE_MAP_FILE_NAME
    );

    const imageMaps = JSON.parse(await fs.readFile(filePath, 'utf-8')) as Record<
      string,
      PkgImageMap
    >;

    logger.info(`Importing ${Object.keys(imageMaps).length} image maps`);

    const [imageMapId, imageMap] = Object.entries(imageMaps)[0];

    await this.apiClient.imageMaps.create(
      {
        id: imageMapId,
        description: imageMap.description,
        objects: Object.entries(imageMap.objects).map(([objId, obj]) => ({
          id: objId,
          description: obj.description,
          outlineCoordinates: obj.outlineCoordinates,
          label: {},
        })),
      },
      path.join(this.imageDirPath, imageMap.baseImagePath)
    );

    /*const createOps = Object.entries(imageMaps).map(([imageMapId, imageMap]) =>
      this.apiClient.imageMaps.create()),
      })
    );

    await Promise.all(createOps);*/
  }

  public async import(): Promise<void> {
    await this.createImageMaps();
  }
}
