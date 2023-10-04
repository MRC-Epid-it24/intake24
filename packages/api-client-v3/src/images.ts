import type { BaseClientV3 } from './base-client-v3';
import type { ApiClientV3 } from './index';

export class ImageApiV3 {
  private readonly baseClient: BaseClientV3;

  constructor(baseClient: BaseClientV3) {
    this.baseClient = baseClient;
  }

  async downloadImage(sourcePath: string, destPath: string): Promise<void> {
    this.baseClient.logger.debug(`Downloading image "${sourcePath}" to "${destPath}"`);
    return this.baseClient.getFile(`/admin/images/download?path=${sourcePath}`, destPath);
  }
}
