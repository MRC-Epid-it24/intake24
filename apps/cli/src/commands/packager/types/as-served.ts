export interface PkgAsServedImage {
  imagePath: string;
  imageKeywords: string[];
  weight: number;
}

export interface PkgAsServedSet {
  id: string;
  description: string;
  selectionImagePath: string;
  images: PkgAsServedImage[];
}
