export interface AdminGuideImageObjectV3 {
  id: number;
  description: string;
  outlineCoordinates: Record<number, number>;
  overlayImageUrl: string;
  weight: number;
}

export interface AdminGuideImageV3 {
  id: string;
  description: string;
  imageMapId: string;
  baseImageUrl: string;
  objects: AdminGuideImageObjectV3[];
}
