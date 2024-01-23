import type { DrinkwareSetEntry } from '@intake24/common/types/http/admin';
import type {
  DrinkwareScaleAttributes,
  DrinkwareVolumeSampleAttributes,
  StandardUnitAttributes,
} from '@intake24/db';

import type { Dictionary, LocaleTranslation } from '../..';

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
  label: LocaleTranslation;
  navigationIndex: number;
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
  objects: { [index: string]: { label: LocaleTranslation; weight: number } };
};

export type DrinkwareVolumeSampleResponse = Pick<
  DrinkwareVolumeSampleAttributes,
  'fill' | 'volume'
>;

export interface DrinkwareScaleResponse
  extends Omit<DrinkwareScaleAttributes, 'id' | 'drinkwareSetId'> {
  volumeSamples: DrinkwareVolumeSampleResponse[];
}

export type DrinkwareSetResponse = Omit<DrinkwareSetEntry, 'description'>;

export type StandardUnitResponse = Pick<StandardUnitAttributes, 'id' | 'estimateIn' | 'howMany'>;

export type WeightResponse = {
  method: string;
  description: string;
  parameters: Dictionary;
  imageUrl: string;
  useForRecipes: boolean;
  conversionFactor: number;
};
