export type SourceImage = {
  id: number;
  path: string;
  uploader: string;
  uploadedAt: Date;
  thumbnailPath: string;
};

export type SourceImageKeyword = {
  sourceImageId: number;
  keyword: string;
};
