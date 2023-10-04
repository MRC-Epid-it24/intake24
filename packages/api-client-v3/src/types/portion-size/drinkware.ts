export interface PortableDrinkScaleV3 {
  width: number;
  height: number;
  emptyLevel: number;
  fullLevel: number;
  baseImagePath: string;
  overlayImagePath: string;
  volumeSamples: number[];
}

export interface PortableDrinkwareSetV3 {
  description: string;
  selectionImageMapId: string;
  scales: Record<number, PortableDrinkScaleV3>;
}
