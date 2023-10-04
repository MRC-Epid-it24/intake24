export interface PkgDrinkScale {
  width: number;
  height: number;
  emptyLevel: number;
  fullLevel: number;
  baseImagePath: string;
  overlayImagePath: string;
  volumeSamples: number[];
}

export interface PkgDrinkwareSet {
  description: string;
  selectionImageMapId: string;
  scales: Record<number, PkgDrinkScale>;
}
