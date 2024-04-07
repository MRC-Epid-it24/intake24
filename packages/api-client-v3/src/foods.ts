import type { BaseClientV3 } from './base-client-v3';
import type { FoodRecordV3 } from './types';

interface LocalFoodCodesResponse {
  localFoodCodes: string[];
}

export class FoodsApiV3 {
  private readonly baseClient: BaseClientV3;

  constructor(baseClient: BaseClientV3) {
    this.baseClient = baseClient;
  }

  public async getLocalFoodCodes(localeId: string): Promise<string[]> {
    const response = await this.baseClient.get<LocalFoodCodesResponse>(
      `/v2/foods/admin/${localeId}/local-food-codes`,
    );
    return response.localFoodCodes;
  }

  public async getEnabledLocalFoodCodes(localeId: string): Promise<string[]> {
    const response = await this.baseClient.get<LocalFoodCodesResponse>(
      `/v2/foods/admin/${localeId}/enabled-local-food-codes`,
    );
    return response.localFoodCodes;
  }

  public async getFoodRecord(localeId: string, foodCode: string): Promise<FoodRecordV3 | null> {
    return this.baseClient.getOptional<FoodRecordV3>(`/admin/foods/${localeId}/${foodCode}`);
  }
}
