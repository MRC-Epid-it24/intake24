export interface PortableAsServedImageV3 {
  sourcePath: string;
  sourceThumbnailPath: string;
  sourceKeywords: string[];
  mainImagePath: string;
  thumbnailPath: string;
  weight: number;
}

export interface PortableAsServedSetV3 {
  id: string;
  description: string;
  selectionSourcePath: string;
  selectionImagePath: string;
  images: PortableAsServedImageV3[];
}
