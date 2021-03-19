import { Dictionary } from '../..';
import { GuideImage, Pagination } from '../../models';

export interface GuideImageListEntry extends Pick<GuideImage, 'id' | 'description'> {
  selectionImageUrl: string;
}

export type GuideImagesResponse = Pagination<GuideImage>;

export type GuideImageEntryObject = {
  id: number;
  description: string;
  overlayUrl: string;
  outlineCoordinates: number[];
  weight: number;
};

export type GuideImageEntry = {
  id: string;
  description: string;
  baseImageUrl: string;
  objects: GuideImageEntryObject[];
};

export type GuideImageRefs = Dictionary;

export type GuideImageResponse = {
  data: GuideImageEntry;
  refs: GuideImageRefs;
};

export type CreateGuideImageResponse = Pick<GuideImageResponse, 'refs'>;

export type StoreGuideImageResponse = Pick<GuideImageResponse, 'data'>;
