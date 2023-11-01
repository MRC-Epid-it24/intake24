import type {
  CreateGlobalFoodRequest,
  FoodEntry,
  UpdateGlobalFoodRequest,
} from '@intake24/common/types/http/admin';

import type { BaseClientV4 } from './base-client-v4';
import type { CreateResult } from './create-response';
import { parseCreateResponse } from './create-response';

export class FoodsApiV4 {
  private static readonly globalApiPath = '/api/admin/fdbs/foods';

  private readonly baseClient: BaseClientV4;

  constructor(baseClient: BaseClientV4) {
    this.baseClient = baseClient;
  }

  public async createGlobalFood(
    createRequest: CreateGlobalFoodRequest
  ): Promise<CreateResult<FoodEntry>> {
    const response = await this.baseClient.postResponse<FoodEntry>(
      `${FoodsApiV4.globalApiPath}`,
      createRequest,
      {}
    );

    return parseCreateResponse(response, this.baseClient.logger);
  }

  public async updateGlobalFood(
    code: string,
    updateRequest: UpdateGlobalFoodRequest
  ): Promise<FoodEntry> {
    return await this.baseClient.put(`${FoodsApiV4.globalApiPath}/${code}`, updateRequest);
  }
}
