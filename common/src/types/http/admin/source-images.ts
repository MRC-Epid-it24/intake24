export type SourceImageType = 'image_maps' | 'as_served';

export type SourceFileInput = {
  originalname: string;
  path: string;
};

export type UploadSourceImageInput = {
  id: string;
  file: SourceFileInput;
  uploader: number | string;
};
