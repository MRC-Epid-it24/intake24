import type { Logger } from 'winston';

import type { CredentialsV4 } from './credentials';
import { BaseClientV4 } from './base-client-v4';
import { FoodsApiV4 } from './foods';
import { ImageMapApiV4 } from './image-maps';
import { LocalesApiV4 } from './locales';
import { PortionSizeApiV4 } from './portion-size';

export type { CredentialsV4 };

export class ApiClientV4 {
  public readonly baseClient: BaseClientV4;
  public readonly locales: LocalesApiV4;
  public readonly imageMaps: ImageMapApiV4;
  public readonly portionSize: PortionSizeApiV4;
  public readonly foods: FoodsApiV4;

  public constructor(
    apiBaseUrl: string,
    logger: Logger,
    maxConcurrentRequests: number,
    refreshToken?: string,
    credentials?: CredentialsV4
  ) {
    this.baseClient = new BaseClientV4(
      apiBaseUrl,
      logger,
      maxConcurrentRequests,
      refreshToken,
      credentials
    );
    this.locales = new LocalesApiV4(this.baseClient);
    this.imageMaps = new ImageMapApiV4(this.baseClient);
    this.portionSize = new PortionSizeApiV4(this.baseClient);
    this.foods = new FoodsApiV4(this.baseClient);
  }
}
