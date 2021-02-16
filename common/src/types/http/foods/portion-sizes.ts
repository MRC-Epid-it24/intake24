import { Dictionary } from '../..';
import { DrinkwareScale, DrinkwareSet, DrinkwareVolumeSample } from '../../models';

export type AsServedImageResponse = {
  mainImageUrl: string;
  thumbnailUrl: string;
  weight: number;
};

export type AsServedSetResponse = {
  id: string;
  description: string;
  selectionImageUrl: string;
  images: AsServedImageResponse[];
};

export type ImageMapObjectResponse = {
  id: number;
  description: string;
  navigationIndex: number;
  overlayUrl: string;
  outline: number[];
};

export type ImageMapResponse = {
  id: string;
  description: string;
  baseImageUrl: string;
  objects: ImageMapObjectResponse[];
};

export type GuideImageResponse = {
  id: string;
  description: string;
  imageMap: ImageMapResponse;
  weights: { [index: number]: number };
};

export type DrinkwareVolumeSampleResponse = Pick<DrinkwareVolumeSample, 'fill' | 'volume'>;

export interface DrinkwareScaleResponse extends Omit<DrinkwareScale, 'id' | 'drinkwareSetId'> {
  volumeSamples: DrinkwareVolumeSampleResponse[];
}

export interface DrinkwareSetResponse extends Pick<DrinkwareSet, 'id' | 'guideImageId'> {
  scales: DrinkwareScaleResponse[];
}

export type WeightResponse = {
  method: string;
  description: string;
  parameters: Dictionary;
  imageUrl: string;
  useForRecipes: boolean;
  conversionFactor: number;
};
