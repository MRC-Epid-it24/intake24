import type { BaseClientV4 } from './base-client-v4';

export class FoodsApiV4 {
  private readonly baseClient: BaseClientV4;

  constructor(baseClient: BaseClientV4) {
    this.baseClient = baseClient;
  }
}
