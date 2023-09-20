export interface ImageMapObjectV3 {
  id: number;
  description: string;
  outlineCoordinates: number[];
}

export interface PortableImageMapV3 {
  description: string;
  baseImagePath: string;
  objects: ImageMapObjectV3[];
}
