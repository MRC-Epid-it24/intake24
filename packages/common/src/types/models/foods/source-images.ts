import type { OmitAndOptional } from '../../common';

export type SourceImageAttributes = {
  id: string;
  path: string;
  thumbnailPath: string;
  uploader: string;
  uploadedAt: Date;
};

export type SourceImageCreationAttributes = OmitAndOptional<
  SourceImageAttributes,
  'id',
  'uploadedAt'
>;

export type SourceImageKeywordAttributes = {
  sourceImageId: string;
  keyword: string;
};
