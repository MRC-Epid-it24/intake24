import type { LocaleTranslation } from '@intake24/common/types';
import type {
  DrinkwareScaleAttributes,
  DrinkwareScalesColumns,
  DrinkwareSetAttributes,
  DrinkwareSetsColumns,
  Pagination,
} from '@intake24/db';

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

export interface DrinkwareScaleEntry
  extends Omit<DrinkwareScalesColumns, 'id' | 'drinkwareSetId' | 'label' | 'choiceId'> {
  version: 1;
  choiceId: number;
  label: LocaleTranslation;
  volumeSamples: number[];
}
export interface DrinkwareScaleV2Entry {
  version: 2;
  choiceId: number;
  label: LocaleTranslation;
  outlineCoordinates: number[];
  volumeSamples: number[];
  baseImageUrl: string;
}

export interface DrinkwareSetEntry extends DrinkwareSetsColumns {
  scales: (DrinkwareScaleEntry | DrinkwareScaleV2Entry)[];
}

export type DrinkwareSetsResponse = Pagination<DrinkwareSetListEntry>;
