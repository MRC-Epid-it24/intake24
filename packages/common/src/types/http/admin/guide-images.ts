import { z } from 'zod';

import type { Pagination } from '@intake24/db';

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

export const guideImageListEntry = z.object({
  id: z.string(),
  description: z.string(),
  imageUrl: z.string(),
});
export type GuideImageListEntry = z.infer<typeof guideImageListEntry>;

export type GuideImagesResponse = Pagination<GuideImageListEntry>;

export interface GuideImageEntry extends ImageMapEntry {
  imageMapId: string;
  objects: GuideImageEntryObject[];
}
