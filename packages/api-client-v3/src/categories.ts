import type { BaseClientV3 } from './base-client-v3';
import type { CategoryRecordV3 } from './types';

export class CategoriesApiV3 {
  private readonly baseClient: BaseClientV3;

  constructor(baseClient: BaseClientV3) {
    this.baseClient = baseClient;
  }

  public async getAllCategoryCodes(): Promise<string[]> {
    return this.baseClient.get<string[]>('/v2/foods/admin/all-category-codes');
  }

  public async getCategoryRecord(
    localeId: string,
    categoryCode: string,
  ): Promise<CategoryRecordV3 | null> {
    return this.baseClient.getOptional<CategoryRecordV3>(
      `/admin/categories/${localeId}/${categoryCode}`,
    );
  }
}
