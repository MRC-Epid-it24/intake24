export type AsServedImageResponse = {
  mainImageUrl: string;
  thumbnailUrl: string;
  weight: number;
};

export type AsServedSetResponse = {
  id: string;
  description: string;
  selectionImageUrl: string;
  images: AsServedImageResponse[];
};
