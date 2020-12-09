export type AsServedImageResponse = {
  imageUrl: string;
  thumbnailUrl: string;
  weight: number;
};

export type AsServedSetResponse = {
  id: string;
  description: string;
  selectionImagePath: string;
  images: AsServedImageResponse[];
};
