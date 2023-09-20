export interface PkgImageMapObject {
  description: string;
  outlineCoordinates: number[];
}

export interface PkgImageMap {
  description: string;
  baseImagePath: string;
  objects: Record<number, PkgImageMapObject>;
}
