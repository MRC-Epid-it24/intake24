export interface PkgDrinkScaleV1 {
  version: 1;
  width: number;
  height: number;
  emptyLevel: number;
  fullLevel: number;
  baseImagePath: string;
  overlayImagePath: string;
  volumeSamples: number[];
}

export interface PkgDrinkScaleV2 {
  version: 2;
  baseImagePath: string;
  outlineCoordinates: number[];
  volumeSamples: number[];
}

export type PkgDrinkScale = PkgDrinkScaleV1 | PkgDrinkScaleV2;

export interface PkgDrinkwareSet {
  description: string;
  selectionImageMapId: string;
  scales: Record<number, PkgDrinkScale>;
}
