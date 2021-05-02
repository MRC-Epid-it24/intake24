export type GuideImageAttributes = {
  id: string;
  description: string;
  imageMapId: string;
  selectionImageId: number;
};

export type GuideImageObjectAttributes = {
  id: number;
  guideImageId: string;
  weight: number;
  imageMapObjectId: number;
};

export type GuideImageObjectCreationAttributes = Omit<GuideImageObjectAttributes, 'id'>;
