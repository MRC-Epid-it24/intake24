export enum ProcessedImagePurposes {
  AsServedMainImage = 1,
  AsServedThumbnail = 2,
  GuideImageSelectionImage = 3,
  ImageMapBaseImage = 4,
  ImageMapOverlay = 5,
}

export type ProcessedImagePurpose = ProcessedImagePurposes;

export type ProcessedImage = {
  id: number;
  path: string;
  sourceId: number;
  purpose: ProcessedImagePurpose;
  createdAt: Date;
};
