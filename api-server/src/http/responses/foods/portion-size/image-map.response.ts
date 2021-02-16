import { ImageMap, ImageMapObject } from '@/db/models/foods';
import { InternalServerError } from '@/http/errors';
import { ImageMapResponse, ImageMapObjectResponse } from '@common/types/http';

export interface ImageMapResponses {
  objectResponse: (item: ImageMapObject) => ImageMapObjectResponse;
  imageResponse: (item: ImageMap) => ImageMapResponse;
}

export default (baseUrl: string): ImageMapResponses => {
  const objectResponse = (item: ImageMapObject): ImageMapObjectResponse => {
    const { id, description, navigationIndex, outlineCoordinates: outline, overlayImage } = item;

    if (!overlayImage)
      throw new InternalServerError('ImageMapResponses: not loaded relationships.');

    return {
      id,
      description,
      navigationIndex,
      outline,
      overlayUrl: `${baseUrl}/${overlayImage.path}`,
    };
  };

  const imageResponse = (item: ImageMap): ImageMapResponse => {
    const { id, description, baseImage, objects } = item;

    if (!baseImage || !objects)
      throw new InternalServerError('ImageMapResponses: not loaded relationships.');

    return {
      id,
      description,
      baseImageUrl: `${baseUrl}/${baseImage.path}`,
      objects: objects.map(objectResponse),
    };
  };

  return { imageResponse, objectResponse };
};
