import { Dictionary } from '../..';
import { ImageMapListEntry, ImageMapEntryObject, ImageMapEntry } from './image-maps';
import { ImageMap, Pagination } from '../../models';

export type GuideImageListEntry = ImageMapListEntry;

export type GuideImagesResponse = Pagination<GuideImageListEntry>;

export interface GuideImageEntryObject extends ImageMapEntryObject {
  weight: number;
}

export interface GuideImageEntry extends ImageMapEntry {
  imageMapId: string;
  objects: GuideImageEntryObject[];
}

export type GuideImageRefs = Dictionary;

export type GuideImageResponse = {
  data: GuideImageEntry;
  refs: GuideImageRefs;
};

export type CreateGuideImageResponse = {
  refs: {
    imageMaps: Pick<ImageMap, 'id' | 'description'>[];
  };
};

export type StoreGuideImageResponse = Pick<GuideImageResponse, 'data'>;
