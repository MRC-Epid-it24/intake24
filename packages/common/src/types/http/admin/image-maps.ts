import { z } from 'zod';

import type { ImageMapObjectAttributes, Pagination } from '@intake24/db';

import type { SourceFileInput } from './source-images';

export type ImageMapEntryObject = Pick<
  ImageMapObjectAttributes,
  'id' | 'description' | 'outlineCoordinates' | 'label' | 'navigationIndex'
>;

export type ImageMapInputObjects = ImageMapEntryObject[];

export interface CreateImageMapInput {
  id: string;
  baseImage: SourceFileInput;
  description: string;
  objects: ImageMapEntryObject[];
  uploader: string;
}

export type UpdateImageMapInput = {
  description: string;
  objects: ImageMapEntryObject[];
};

export const imageMapListEntry = z.object({
  id: z.string(),
  description: z.string(),
  imageUrl: z.string(),
});
export type ImageMapListEntry = z.infer<typeof imageMapListEntry>;

export type ImageMapsResponse = Pagination<ImageMapListEntry>;

export type ImageMapEntry = {
  id: string;
  description: string;
  baseImageUrl: string;
  objects: ImageMapEntryObject[];
};
