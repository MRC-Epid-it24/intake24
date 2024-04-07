export type SourceImageConfig = {
  thumbnailWidth: number;
  thumbnailHeight: number;
};

export type AsServedImageConfig = {
  width: number;
  thumbnailWidth: number;
};

export type SelectionScreenImageConfig = {
  width: number;
  height: number;
};

export type ImageMapsConfig = {
  width: number;
};

export type SlidingScaleConfig = {
  width: number;
};

export type ImageProcessorConfig = {
  source: SourceImageConfig;
  asServed: AsServedImageConfig;
  imageMaps: ImageMapsConfig;
  drinkScale: SlidingScaleConfig;
  optionSelection: SelectionScreenImageConfig;
};

const imageProcessorConfig: ImageProcessorConfig = {
  source: {
    thumbnailWidth: Number.parseInt(process.env.IMAGE_SOURCE_THUMB_WIDTH || '768', 10),
    thumbnailHeight: Number.parseInt(process.env.IMAGE_SOURCE_THUMB_HEIGHT || '432', 10),
  },
  asServed: {
    width: Number.parseInt(process.env.IMAGE_AS_SERVED_WIDTH || '1000', 10),
    thumbnailWidth: Number.parseInt(process.env.IMAGE_AS_SERVED_THUMB_WIDTH || '200', 10),
  },
  imageMaps: {
    width: Number.parseInt(process.env.IMAGE_MAP_WIDTH || '1000', 10),
  },
  drinkScale: {
    width: Number.parseInt(process.env.IMAGE_DRINK_SCALE_WIDTH || '1000', 10),
  },
  optionSelection: {
    width: Number.parseInt(process.env.IMAGE_OPTION_SELECTION_WIDTH || '300', 10),
    height: Number.parseInt(process.env.IMAGE_OPTION_SELECTION_HEIGHT || '200', 10),
  },
};

export default imageProcessorConfig;
