import type { Dictionary } from '../..';
import type {
  DrinkwareScaleAttributes,
  DrinkwareSetAttributes,
  DrinkwareVolumeSampleAttributes,
  StandardUnitAttributes,
} from '../../models';

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
  id: string;
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
  weights: { [index: string]: number };
};

export type DrinkwareVolumeSampleResponse = Pick<
  DrinkwareVolumeSampleAttributes,
  'fill' | 'volume'
>;

export interface DrinkwareScaleResponse
  extends Omit<DrinkwareScaleAttributes, 'id' | 'drinkwareSetId'> {
  volumeSamples: DrinkwareVolumeSampleResponse[];
}

export interface DrinkwareSetResponse extends Pick<DrinkwareSetAttributes, 'id' | 'guideImageId'> {
  scales: DrinkwareScaleResponse[];
}

export type StandardUnitResponse = Pick<StandardUnitAttributes, 'id' | 'estimateIn' | 'howMany'>;

export type WeightResponse = {
  method: string;
  description: string;
  parameters: Dictionary;
  imageUrl: string;
  useForRecipes: boolean;
  conversionFactor: number;
};
