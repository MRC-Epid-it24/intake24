import type { LocaleEntry, LocalesResponse } from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';

import type { BaseClientV4 } from './base-client-v4';

export class LocalesApiV4 {
  private readonly baseClient: BaseClientV4;

  constructor(baseClient: BaseClientV4) {
    this.baseClient = baseClient;
  }

  public async list(pagination: PaginateQuery): Promise<LocalesResponse> {
    return this.baseClient.get<LocalesResponse>('/api/admin/locales', undefined, pagination);
  }

  public async get(localeId: string): Promise<LocaleEntry | null> {
    return this.baseClient.getOptional<LocaleEntry>(`/api/admin/locales/${localeId}`);
  }
}
