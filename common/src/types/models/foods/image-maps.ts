import { Optional } from '../model';

export type ImageMapAttributes = {
  id: string;
  description: string;
  baseImageId: number;
};

export type ImageMapObjectAttributes = {
  id: number;
  imageMapId: string;
  description: string;
  navigationIndex: number;
  outlineCoordinates: number[];
  overlayImageId: number | null;
};

export type ImageMapObjectCreationAttributes = Optional<ImageMapObjectAttributes, 'overlayImageId'>;
