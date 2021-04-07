import { Dictionary } from '../..';
import { ImageMap, Pagination } from '../../models';

export type ImageMapEntryObject = {
  id: number;
  description: string;
  outlineCoordinates: number[];
};

export type ImageMapInputObjects = ImageMapEntryObject[];

export type UpdateImageMapInput = {
  description: string;
  objects: ImageMapEntryObject[];
};

export interface ImageMapListEntry extends Pick<ImageMap, 'id' | 'description'> {
  imageUrl: string;
}

export type ImageMapsResponse = Pagination<ImageMapListEntry>;

export type ImageMapEntry = {
  id: string;
  description: string;
  baseImageUrl: string;
  objects: ImageMapEntryObject[];
};

export type ImageMapRefs = Dictionary;

export type ImageMapResponse = {
  data: ImageMapEntry;
  refs: ImageMapRefs;
};

export type CreateImageMapResponse = Pick<ImageMapResponse, 'refs'>;

export type StoreImageMapResponse = Pick<ImageMapResponse, 'data'>;
