import type { CategoryContents } from '@intake24/common/types/http';
import type { MainCategoriesResponse } from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';

import type { BaseClientV4 } from './base-client-v4';

export class CategoriesApiV4 {
  private static readonly adminApiPath = '/api/admin/categories';
  private static readonly apiPath = '/api/categories';

  private readonly baseClient: BaseClientV4;

  constructor(baseClient: BaseClientV4) {
    this.baseClient = baseClient;
  }

  public async list(pagination: PaginateQuery): Promise<MainCategoriesResponse> {
    return this.baseClient.get<MainCategoriesResponse>(
      `${CategoriesApiV4.adminApiPath}`,
      undefined,
      pagination
    );
  }

  public async getRootCategories(localeId: string): Promise<CategoryContents> {
    return this.baseClient.get<CategoryContents>(`${CategoriesApiV4.apiPath}/${localeId}`);
  }

  public async getCategoryContents(
    categoryCode: string,
    localeId: string
  ): Promise<CategoryContents> {
    return this.baseClient.get<CategoryContents>(
      `${CategoriesApiV4.apiPath}/${localeId}/${categoryCode}`
    );
  }
}
