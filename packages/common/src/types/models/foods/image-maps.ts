import type { Optional } from '../../common';

export type ImageMapAttributes = {
  id: string;
  description: string;
  baseImageId: string;
};

export type ImageMapObjectAttributes = {
  id: string;
  imageMapId: string;
  description: string;
  navigationIndex: number;
  outlineCoordinates: number[];
  overlayImageId: string | null;
};

export type ImageMapObjectCreationAttributes = Optional<ImageMapObjectAttributes, 'overlayImageId'>;
