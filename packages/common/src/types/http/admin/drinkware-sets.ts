import type {
  DrinkwareScaleAttributes,
  DrinkwareScaleV2Attributes,
  DrinkwareSetAttributes,
  Pagination,
} from '@intake24/db';
import { DrinkwareVolumeSample } from '@intake24/db';

export type DrinkwareScaleInputObjects = Pick<DrinkwareScaleAttributes, 'id' | 'label'>[];

export type CreateDrinkwareSetInput = {
  id: string;
  description: string;
  imageMapId: string;
};

export type UpdateDrinkwareSetInput = {
  description: string;
  scales: DrinkwareScaleInputObjects;
};

export interface DrinkwareSetListEntry extends Pick<DrinkwareSetAttributes, 'id' | 'description'> {
  imageUrl: string;
}

export type DrinkwareSetsResponse = Pagination<DrinkwareSetListEntry>;

export interface DrinkwareSetEntry extends DrinkwareSetAttributes {
  imageUrl: string;
  scales: DrinkwareScaleAttributes[];
}

export interface DrinkScaleEntry
  extends Pick<
    DrinkwareScaleAttributes,
    'id' | 'width' | 'height' | 'emptyLevel' | 'fullLevel' | 'choiceId' | 'label'
  > {
  version: 1;
  volumeSamples: number[];
  overlayImageUrl: string;
  baseImageUrl: string;
}

export type DrinkScalesResponse = Pagination<DrinkScaleEntry>;

export interface DrinkScaleV2Entry
  extends Pick<DrinkwareScaleV2Attributes, 'id' | 'choiceId' | 'label'> {
  version: 2;
  outlineCoordinates: number[];
  volumeSamples: number[];
  baseImageUrl: string;
}

export type DrinkScalesV2Response = Pagination<DrinkScaleV2Entry>;
