export interface ImageMapObjectV3 {
  id: number;
  description: string;
  navigationIndex: number;
  outlineCoordinates: number[];
}

export interface PortableImageMapV3 {
  description: string;
  baseImagePath: string;
  objects: ImageMapObjectV3[];
}
