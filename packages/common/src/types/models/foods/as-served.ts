export type AsServedSetAttributes = {
  id: string;
  description: string;
  selectionImageId: string;
};

export type AsServedImageAttributes = {
  id: string;
  weight: number;
  asServedSetId: string;
  imageId: string;
  thumbnailImageId: string;
};

export type AsServedImageCreationAttributes = Omit<AsServedImageAttributes, 'id'>;
