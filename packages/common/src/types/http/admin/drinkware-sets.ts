import type { DrinkwareScaleAttributes, DrinkwareSetAttributes, Pagination } from '@intake24/db';

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
