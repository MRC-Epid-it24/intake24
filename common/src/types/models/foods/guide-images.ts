export type GuideImageAttributes = {
  id: string;
  description: string;
  imageMapId: string;
  selectionImageId: string;
};

export type GuideImageObjectAttributes = {
  id: string;
  guideImageId: string;
  weight: number;
  imageMapObjectId: string;
};

export type GuideImageObjectCreationAttributes = Omit<GuideImageObjectAttributes, 'id'>;
