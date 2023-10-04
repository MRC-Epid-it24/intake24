import type { ImageMapAttributes, ImageMapObjectAttributes, Pagination } from '@intake24/db';

import type { SourceFileInput, UploadSourceImageInput } from './source-images';

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

export interface ImageMapListEntry extends Pick<ImageMapAttributes, 'id' | 'description'> {
  imageUrl: string;
}

export type ImageMapsResponse = Pagination<ImageMapListEntry>;

export type ImageMapEntry = {
  id: string;
  description: string;
  baseImageUrl: string;
  objects: ImageMapEntryObject[];
};
