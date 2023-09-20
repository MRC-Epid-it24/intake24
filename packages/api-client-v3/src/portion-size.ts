import type { BaseClientV3 } from './base-client-v3';
import type {
  AdminGuideImageV3,
  PortableAsServedSetV3,
  PortableDrinkwareSetV3,
  PortableImageMapV3,
} from './types';

export class PortionSizeApiV3 {
  private readonly baseClient: BaseClientV3;

  constructor(baseClient: BaseClientV3) {
    this.baseClient = baseClient;
  }

  public async exportAsServedSet(id: string): Promise<PortableAsServedSetV3 | null> {
    return this.baseClient.getOptional<PortableAsServedSetV3>(
      `/admin/portion-size/as-served/${id}/export`
    );
  }

  public async getGuideImage(id: string): Promise<AdminGuideImageV3 | null> {
    return this.baseClient.getOptional<AdminGuideImageV3>(`/admin/portion-size/guide-image/${id}`);
  }

  public async exportImageMap(imageMapId: string): Promise<PortableImageMapV3 | null> {
    return this.baseClient.getOptional<PortableImageMapV3>(
      `/v2/foods/admin/portion-size/image-maps/${imageMapId}/export`
    );
  }

  public async exportDrinkwareSet(drinkwareSetId: string): Promise<PortableDrinkwareSetV3 | null> {
    return this.baseClient.getOptional<PortableDrinkwareSetV3>(
      `/v2/foods/admin/portion-size/drinkware/${drinkwareSetId}/export`
    );
  }
}
