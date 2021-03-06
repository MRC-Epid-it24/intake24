import { GuideImage, ImageMap, ImageMapObject } from '@/db/models/foods';
import { InternalServerError } from '@/http/errors';
import { GuideImageResponse, ImageMapResponse, ImageMapObjectResponse } from '@common/types/http';

export interface ImageMapsResponse {
  objectResponse: (item: ImageMapObject) => ImageMapObjectResponse;
  imageResponse: (item: ImageMap) => ImageMapResponse;
  guideResponse: (item: GuideImage) => GuideImageResponse;
}

export default (baseUrl: string): ImageMapsResponse => {
  /**
   * Response for image map objects
   *
   * @param {ImageMapObject} item
   * @returns {ImageMapObjectResponse}
   */
  const objectResponse = (item: ImageMapObject): ImageMapObjectResponse => {
    const { id, description, navigationIndex, outlineCoordinates: outline, overlayImage } = item;

    if (!overlayImage)
      throw new InternalServerError('ImageMapObjectResponse: not loaded relationships.');

    return {
      id,
      description,
      navigationIndex,
      outline,
      overlayUrl: `${baseUrl}/${overlayImage.path}`,
    };
  };

  /**
   * Response for image map
   *
   * @param {ImageMap} item
   * @returns {ImageMapResponse}
   */
  const imageResponse = (item: ImageMap): ImageMapResponse => {
    const { id, description, baseImage, objects } = item;

    if (!baseImage || !objects)
      throw new InternalServerError('ImageMapResponse: not loaded relationships.');

    return {
      id,
      description,
      baseImageUrl: `${baseUrl}/${baseImage.path}`,
      objects: objects.map(objectResponse),
    };
  };

  /**
   * Response for guide image
   *
   * @param {GuideImage} item
   * @returns {GuideImageResponse}
   */
  const guideResponse = (item: GuideImage): GuideImageResponse => {
    const { id, description, imageMap, objects } = item;

    if (!imageMap || !objects)
      throw new InternalServerError('GuideImageResponse: not loaded relationships.');

    const weights = objects.reduce((acc, object) => {
      acc[object.imageMapObjectId] = object.weight;
      return acc;
    }, {} as { [index: number]: number });

    return {
      id,
      description,
      imageMap: imageResponse(imageMap),
      weights,
    };
  };

  return { guideResponse, imageResponse, objectResponse };
};
