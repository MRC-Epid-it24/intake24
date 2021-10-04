export type DrinkwareSetAttributes = {
  id: string;
  description: string;
  guideImageId: string;
};

export type DrinkwareScaleAttributes = {
  id: string;
  drinkwareSetId: string;
  width: number;
  height: number;
  emptyLevel: number;
  fullLevel: number;
  choiceId: number;
  baseImageUrl: string;
  overlayImageUrl: string;
};

export type DrinkwareScaleCreationAttributes = Omit<DrinkwareScaleAttributes, 'id'>;

export type DrinkwareVolumeSampleAttributes = {
  id: string;
  drinkwareScaleId: string;
  fill: number;
  volume: number;
};

export type DrinkwareVolumeSampleCreationAttributes = Omit<DrinkwareVolumeSampleAttributes, 'id'>;
