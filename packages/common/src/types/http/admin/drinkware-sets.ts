import type { DrinkwareScaleAttributes, DrinkwareSetAttributes, Pagination } from '@intake24/db';

export interface DrinkwareSetListEntry extends Pick<DrinkwareSetAttributes, 'id' | 'description'> {
  imageUrl: string;
}

export type DrinkwareSetsResponse = Pagination<DrinkwareSetListEntry>;

export interface DrinkwareSetEntry extends DrinkwareSetAttributes {
  imageUrl: string;
  scales: DrinkwareScaleAttributes[];
}
