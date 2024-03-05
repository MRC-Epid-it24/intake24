import { z } from 'zod';

import type { DrinkwareSetAttributes, Pagination } from '@intake24/db';
import { type Dictionary, type LocaleTranslation, localeTranslation } from '@intake24/common/types';

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

export const drinkwareScaleEntry = z.object({
  baseImageUrl: z.string(),
  emptyLevel: z.number(),
  fullLevel: z.number(),
  height: z.number(),
  overlayImageUrl: z.string(),
  width: z.number(),
  version: z.literal(1),
  choiceId: z.number(),
  label: localeTranslation,
  volumeSamples: z.array(z.number()),
});

export type DrinkwareScaleEntry = z.infer<typeof drinkwareScaleEntry>;

export const drinkwareScaleV2Entry = z.object({
  version: z.literal(2),
  choiceId: z.number(),
  label: localeTranslation,
  outlineCoordinates: z.array(z.number()),
  volumeSamples: z.array(z.number()),
  volumeSamplesNormalised: z.array(z.number()),
  baseImageUrl: z.string(),
});

export type DrinkwareScaleV2Entry = z.infer<typeof drinkwareScaleV2Entry>;

export const drinkwareSetEntry = z.object({
  id: z.string(),
  description: z.string(),
  imageMapId: z.string(),
  scales: z.union([drinkwareScaleEntry, drinkwareScaleV2Entry]).array(),
});

export type DrinkwareSetEntry = z.infer<typeof drinkwareSetEntry>;

export type DrinkwareSetsResponse = Pagination<DrinkwareSetListEntry>;
