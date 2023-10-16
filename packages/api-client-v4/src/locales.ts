import type {
  CreateLocaleRequest,
  LocaleEntry,
  LocalesResponse,
} from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';

import type { BaseClientV4 } from './base-client-v4';

export class LocalesApiV4 {
  private static readonly apiPath = '/api/admin/locales';

  private readonly baseClient: BaseClientV4;

  constructor(baseClient: BaseClientV4) {
    this.baseClient = baseClient;
  }

  public async list(pagination: PaginateQuery): Promise<LocalesResponse> {
    return this.baseClient.get<LocalesResponse>(`${LocalesApiV4.apiPath}`, undefined, pagination);
  }

  public async get(localeId: string): Promise<LocaleEntry | null> {
    return this.baseClient.getOptional<LocaleEntry>(`${LocalesApiV4.apiPath}/${localeId}`);
  }

  public async create(localeId: string, locale: CreateLocaleRequest): Promise<LocaleEntry> {
    return this.baseClient.post<LocaleEntry>(`${LocalesApiV4.apiPath}`, locale);
  }
}
