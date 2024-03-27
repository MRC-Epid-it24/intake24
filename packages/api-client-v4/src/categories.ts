import type { CategoryContents } from '@intake24/common/types/http';
import type {
  CreateGlobalCategoryRequest,
  CreateLocalCategoryRequest,
  GlobalCategoryEntry,
  MainCategoriesResponse,
  UpdateGlobalCategoryRequest,
  UpdateLocalCategoryRequest,
} from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';

import type { BaseClientV4 } from './base-client-v4';
import type { CreateResult } from './create-response';
import { parseCreateResponse } from './create-response';

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

  public async createCategory(
    request: CreateGlobalCategoryRequest
  ): Promise<CreateResult<any, GlobalCategoryEntry>> {
    const response = await this.baseClient.postResponse(
      `${CategoriesApiV4.adminApiPath}/global`,
      request
    );

    return parseCreateResponse(response, this.baseClient.logger);
  }

  public async updateCategory(
    categoryCode: string,
    version: string,
    request: UpdateGlobalCategoryRequest
  ): Promise<void> {
    await this.baseClient.put(`${CategoriesApiV4.adminApiPath}/global/${categoryCode}`, request, {
      version,
    });
  }

  public async createCategoryLocal(
    localeId: string,
    request: CreateLocalCategoryRequest
  ): Promise<CreateResult<any, GlobalCategoryEntry>> {
    const response = await this.baseClient.postResponse(
      `${CategoriesApiV4.adminApiPath}/local/${localeId}`,
      request
    );

    return parseCreateResponse(response, this.baseClient.logger);
  }

  public async updateCategoryLocal(
    localeId: string,
    categoryCode: string,
    version: string,
    request: UpdateLocalCategoryRequest
  ): Promise<void> {
    await this.baseClient.put(
      `${CategoriesApiV4.adminApiPath}/local/${localeId}/${categoryCode}`,
      request,
      {
        version,
      }
    );
  }
}
