import type { Logger } from 'winston';

import type { CredentialsV4 } from './credentials';
import type { ApiClientOptionsV4 } from './options';
import { BaseClientV4 } from './base-client-v4';
import { CategoriesApiV4 } from './categories';
import { FoodsApiV4 } from './foods';
import { ImageMapApiV4 } from './image-maps';
import { LocalesApiV4 } from './locales';
import { getApiClientV4EnvOptions } from './options';
import { PortionSizeApiV4 } from './portion-size';

export type { ApiClientOptionsV4, CredentialsV4 };

export { getApiClientV4EnvOptions };

export class ApiClientV4 {
  public readonly baseClient: BaseClientV4;
  public readonly locales: LocalesApiV4;
  public readonly imageMaps: ImageMapApiV4;
  public readonly portionSize: PortionSizeApiV4;
  public readonly foods: FoodsApiV4;
  public readonly categories: CategoriesApiV4;

  public constructor(logger: Logger, options: ApiClientOptionsV4) {
    this.baseClient = new BaseClientV4(logger, options);
    this.locales = new LocalesApiV4(this.baseClient);
    this.imageMaps = new ImageMapApiV4(this.baseClient);
    this.portionSize = new PortionSizeApiV4(this.baseClient);
    this.foods = new FoodsApiV4(this.baseClient);
    this.categories = new CategoriesApiV4(this.baseClient);
  }
}
