import { Dictionary } from '../..';
import { AsServedSetAttributes, AsServedImageAttributes, Pagination } from '../../models';
import { UploadSourceImageInput } from './source-images';

export type AsServedImageInput = Pick<AsServedImageAttributes, 'id' | 'weight'>;

export type AsServedImageInputs = AsServedImageInput[];

export interface CreateAsServedImageInput extends UploadSourceImageInput {
  weight: number;
}

export interface CreateAsServedSetInput extends UploadSourceImageInput {
  description: string;
}

export type UpdateAsServedSetInput = {
  description: string;
  images: AsServedImageInputs;
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

export type AsServedImageResponse = {
  data: AsServedImageEntry;
};

export type AsServedSetEntry = {
  id: string;
  description: string;
  selectionImageUrl: string;
  images: AsServedImageEntry[];
};

export type AsServedSetRefs = Dictionary;

export type AsServedSetResponse = {
  data: AsServedSetEntry;
  refs: AsServedSetRefs;
};

export type CreateAsServedSetResponse = Pick<AsServedSetResponse, 'refs'>;

export type StoreAsServedSetResponse = Pick<AsServedSetResponse, 'data'>;
