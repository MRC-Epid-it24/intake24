import type { DrinkwareSetAttributes, GuideImageAttributes, Pagination } from '../../models';

export interface DrinkwareSetListEntry extends Pick<DrinkwareSetAttributes, 'id' | 'description'> {
  imageUrl: string | null;
}

export type DrinkwareSetsResponse = Pagination<DrinkwareSetListEntry>;

export type DrinkwareSetEntry = DrinkwareSetAttributes;

export type DrinkwareSetRefs = {
  guideImages: Pick<GuideImageAttributes, 'id' | 'description'>[];
};
