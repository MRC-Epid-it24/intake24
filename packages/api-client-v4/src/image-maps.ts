import { FormData } from 'formdata-node';

import type { ImageMap } from '@intake24/db';

import type { BaseClientV4 } from './base-client-v4';
import { fileFromPathWithType } from './form-data-helpers';

export interface ImageMapCreateRequestObject {
  id: string;
  description: string;
  outlineCoordinates: number[];
}

export interface ImageMapCreateRequest {
  id: string;
  description: string;
  objects: ImageMapCreateRequestObject[];
}

export class ImageMapApiV4 {
  private readonly baseClient: BaseClientV4;

  constructor(baseClient: BaseClientV4) {
    this.baseClient = baseClient;
  }

  public async create(
    imageMap: ImageMapCreateRequest,
    baseImageFilePath: string
  ): Promise<ImageMap> {
    const formData = new FormData();

    const file = await fileFromPathWithType(baseImageFilePath);

    formData.set('id', imageMap.id);
    formData.set('description', imageMap.description);
    //formData.set('objects', JSON.stringify(imageMap.objects));
    formData.set('objects', '{{{{{');

    formData.set('baseImage', file);

    return this.baseClient.post<ImageMap>('/api/admin/images/image-maps', formData);
  }
}
