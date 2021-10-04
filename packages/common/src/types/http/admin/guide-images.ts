import { Dictionary } from '../..';
import { ImageMapListEntry, ImageMapEntryObject, ImageMapEntry } from './image-maps';
import { ImageMapAttributes, Pagination } from '../../models';

export interface GuideImageEntryObject extends ImageMapEntryObject {
  weight: number;
}

export type GuideImageInputObjects = Pick<GuideImageEntryObject, 'id' | 'weight'>[];

export type CreateGuideImageInput = {
  id: string;
  description: string;
  imageMapId: string;
};

export type UpdateGuideImageInput = {
  description: string;
  objects: GuideImageInputObjects;
};

export type GuideImageListEntry = ImageMapListEntry;

export type GuideImagesResponse = Pagination<GuideImageListEntry>;

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
    imageMaps: Pick<ImageMapAttributes, 'id' | 'description'>[];
  };
};

export type StoreGuideImageResponse = Pick<GuideImageResponse, 'data'>;
