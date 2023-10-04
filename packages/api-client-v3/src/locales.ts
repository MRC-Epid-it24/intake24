import type { BaseClientV3 } from './base-client-v3';
import type { Locales, LocaleV3 } from './types/locales';

export class LocalesApiV3 {
  private readonly baseClient: BaseClientV3;

  constructor(baseClient: BaseClientV3) {
    this.baseClient = baseClient;
  }

  public async list(): Promise<Locales> {
    return this.baseClient.get<Locales>('/admin/locales');
  }

  public async get(localeId: string): Promise<LocaleV3 | null> {
    return this.baseClient.getOptional<LocaleV3>(`/admin/locales/${localeId}`);
  }
}
