import { z } from 'zod';

import type { AsServedImageAttributes, Pagination } from '@intake24/db';

import type { UploadSourceImageInput } from './source-images';

export type AsServedImageInput = Pick<AsServedImageAttributes, 'id' | 'weight'>;

export interface CreateAsServedImageInput extends UploadSourceImageInput {
  weight: number;
}

export interface CreateAsServedSetInput extends UploadSourceImageInput {
  description: string;
}

export type UpdateAsServedSetInput = {
  description: string;
  images: AsServedImageInput[];
};

export const asServedSetListEntry = z.object({
  id: z.string(),
  description: z.string(),
  imageUrl: z.string(),
});
export type AsServedSetListEntry = z.infer<typeof asServedSetListEntry>;

export type AsServedSetsResponse = Pagination<AsServedSetListEntry>;

export interface AsServedImageEntry extends Pick<AsServedImageAttributes, 'id' | 'weight'> {
  mainImageUrl: string;
  thumbnailUrl: string;
}

export type AsServedImagesResponse = Pagination<AsServedImageEntry>;

export type AsServedSetEntry = {
  id: string;
  description: string;
  selectionImageUrl: string;
  images: AsServedImageEntry[];
};
