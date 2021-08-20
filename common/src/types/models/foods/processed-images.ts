import { OmitAndOptional } from '../model';

export enum ProcessedImagePurposes {
  AsServedMainImage = 1,
  AsServedThumbnail = 2,
  SelectionImage = 3,
  ImageMapBaseImage = 4,
  ImageMapOverlay = 5,
}

export type ProcessedImagePurpose = ProcessedImagePurposes;

export type ProcessedImageAttributes = {
  id: string;
  path: string;
  sourceId: string;
  purpose: ProcessedImagePurpose;
  createdAt: Date;
};

export type ProcessedImageCreationAttributes = OmitAndOptional<
  ProcessedImageAttributes,
  'id',
  'createdAt'
>;
