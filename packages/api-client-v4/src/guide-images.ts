import type { BaseClientV4 } from './base-client-v4';
import type {
  GuideImageInputObject,
} from '@intake24/common/types/http/admin';

import { GuideImage } from '@intake24/db';

export class GuideImageApiV4 {
  private static readonly apiPath = '/api/admin/images/guide-images';

  private readonly baseClient: BaseClientV4;

  constructor(baseClient: BaseClientV4) {
    this.baseClient = baseClient;
  }

  public async create(
    id: string,
    description: string,
    imageMapId: string,
  ): Promise<GuideImage> {
    return this.baseClient.post<GuideImage>(GuideImageApiV4.apiPath, {
      id,
      description,
      imageMapId,
    });
  }

  public async update(
    id: string,
    description: string,
    objects: GuideImageInputObject[],
  ): Promise<GuideImage> {
    return this.baseClient.put<GuideImage>(`${GuideImageApiV4.apiPath}/${id}`, {
      id,
      description,
      objects,
    });
  }

  public async get(id: string): Promise<GuideImage | null> {
    return this.baseClient.getOptional<GuideImage>(`${GuideImageApiV4.apiPath}/${id}`);
  }
}
