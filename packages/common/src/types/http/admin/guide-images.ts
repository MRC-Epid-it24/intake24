import type { GuideImageAttributes, Pagination } from '@intake24/db';

import type { ImageMapEntry, ImageMapEntryObject } from './image-maps';

export interface GuideImageEntryObject extends ImageMapEntryObject {
  weight: number;
}

export type GuideImageInputObjects = Pick<GuideImageEntryObject, 'id' | 'weight' | 'label'>[];

export type CreateGuideImageInput = {
  id: string;
  description: string;
  imageMapId: string;
};

export type UpdateGuideImageInput = {
  description: string;
  objects: GuideImageInputObjects;
};

export interface GuideImageListEntry extends Pick<GuideImageAttributes, 'id' | 'description'> {
  imageUrl: string;
}

export type GuideImagesResponse = Pagination<GuideImageListEntry>;

export interface GuideImageEntry extends ImageMapEntry {
  imageMapId: string;
  objects: GuideImageEntryObject[];
}
