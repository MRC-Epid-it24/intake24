import { OmitAndOptional } from '../model';

export type SourceImageAttributes = {
  id: number;
  path: string;
  uploader: string;
  uploadedAt: Date;
  thumbnailPath: string;
};

export type SourceImageCreationAttributes = OmitAndOptional<
  SourceImageAttributes,
  'id',
  'uploadedAt'
>;

export type SourceImageKeywordAttributes = {
  sourceImageId: number;
  keyword: string;
};
