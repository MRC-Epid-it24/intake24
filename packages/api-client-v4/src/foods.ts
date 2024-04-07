import type {
  CreateGlobalFoodRequest,
  CreateLocalFoodRequest,
  CreateLocalFoodRequestOptions,
  FoodEntry,
  UpdateGlobalFoodRequest,
} from '@intake24/common/types/http/admin';

import type { BaseClientV4 } from './base-client-v4';
import type { CreateResult } from './create-response';
import { parseCreateResponse } from './create-response';

export class FoodsApiV4 {
  private static readonly globalApiPath = '/api/admin/foods/global';
  private static readonly localApiPath = '/api/admin/foods/local';

  private readonly baseClient: BaseClientV4;

  constructor(baseClient: BaseClientV4) {
    this.baseClient = baseClient;
  }

  public async createGlobalFood(
    createRequest: CreateGlobalFoodRequest,
  ): Promise<CreateResult<FoodEntry>> {
    const response = await this.baseClient.postResponse<FoodEntry>(
      `${FoodsApiV4.globalApiPath}`,
      createRequest,
      {},
    );

    return parseCreateResponse(response, this.baseClient.logger);
  }

  public async findGlobalFood(code: string): Promise<FoodEntry | null> {
    return await this.baseClient.getOptional<FoodEntry>(`${FoodsApiV4.globalApiPath}/${code}`);
  }

  public async updateGlobalFood(
    code: string,
    version: string,
    updateRequest: UpdateGlobalFoodRequest,
  ): Promise<FoodEntry> {
    return await this.baseClient.put(
      `${FoodsApiV4.globalApiPath}/${code}?version=${version}`,
      updateRequest,
    );
  }

  public async createLocalFood(
    localeId: string,
    createRequest: CreateLocalFoodRequest,
    options: CreateLocalFoodRequestOptions,
  ): Promise<CreateResult<FoodEntry>> {
    const response = await this.baseClient.postResponse<FoodEntry>(
      `${FoodsApiV4.localApiPath}/${localeId}`,
      createRequest,
      options,
    );

    return parseCreateResponse(response, this.baseClient.logger);
  }

  public async updateEnabledFoods(localeId: string, enabledFoods: string[]) {
    await this.baseClient.post<FoodEntry>(`${FoodsApiV4.localApiPath}/${localeId}/enabled-foods`, {
      enabledFoods,
    });
  }
}
