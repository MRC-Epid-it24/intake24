import type { Dictionary, LocaleTranslation } from '@intake24/common/types';
import type {
  DrinkwareScaleAttributes,
  DrinkwareScalesColumns,
  DrinkwareSetAttributes,
  DrinkwareSetsColumns,
  Pagination,
} from '@intake24/db';

export type CreateDrinkwareSetInput = {
  id: string;
  description: string;
  imageMapId: string;
};

export type UpdateDrinkwareScaleInput = {
  label?: LocaleTranslation;
  outlineCoordinates?: number[];
  volumeSamples?: number[];
};

export type UpdateDrinkwareSetInput = {
  description: string;
  imageMapId: string;
  scales: Dictionary<UpdateDrinkwareScaleInput>;
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
  volumeSamplesNormalised: number[];
  baseImageUrl: string;
}

export interface DrinkwareSetEntry extends DrinkwareSetsColumns {
  scales: (DrinkwareScaleEntry | DrinkwareScaleV2Entry)[];
}

export type DrinkwareSetsResponse = Pagination<DrinkwareSetListEntry>;
