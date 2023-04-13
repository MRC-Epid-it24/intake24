import type { AsServedImageAttributes, AsServedSetAttributes, Pagination } from '@intake24/db';

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

export interface AsServedSetListEntry extends Pick<AsServedSetAttributes, 'id' | 'description'> {
  imageUrl: string;
}

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
