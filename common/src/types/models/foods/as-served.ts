export type AsServedSetAttributes = {
  id: string;
  description: string;
  selectionImageId: number;
};

export type AsServedImageAttributes = {
  id: number;
  weight: number;
  asServedSetId: string;
  imageId: number;
  thumbnailImageId: number;
};

export type AsServedImageCreationAttributes = Omit<AsServedImageAttributes, 'id'>;
