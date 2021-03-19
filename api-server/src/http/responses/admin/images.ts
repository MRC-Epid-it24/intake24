import { GuideImage, ImageMapObject } from '@/db/models/foods';
import { InternalServerError } from '@/http/errors';
import {
  GuideImageEntry,
  GuideImageEntryObject,
  GuideImageListEntry,
} from '@common/types/http/admin';

export interface ImageResponseCollection {
  guideListResponse: (item: GuideImage) => GuideImageListEntry;
  guideEntryResponse: (item: GuideImage) => GuideImageEntry;
}

type Weights = { [index: number]: number };

export default (baseUrl: string): ImageResponseCollection => {
  const mapObjects = (objects: ImageMapObject[], weights: Weights): GuideImageEntryObject[] => {
    return objects.map((object) => {
      const { id, description, outlineCoordinates, overlayImage } = object;

      if (!overlayImage)
        throw new InternalServerError('GuideImageEntryObject: not loaded relationships.');

      return {
        id,
        description,
        outlineCoordinates,
        overlayUrl: `${baseUrl}/${overlayImage.path}`,
        weight: weights[id],
      };
    });
  };

  /**
   * Guide image list entry
   *
   * @param {GuideImage} item
   * @returns {GuideImageResponse}
   */
  const guideListResponse = (item: GuideImage): GuideImageListEntry => {
    const { id, description, selectionImage } = item;

    if (!selectionImage)
      throw new InternalServerError('GuideImageListEntry: not loaded relationships.');

    return {
      id,
      description,
      selectionImageUrl: `${baseUrl}/${selectionImage.path}`,
    };
  };

  /**
   * Guide image entry
   *
   * @param {GuideImage} item
   * @returns {GuideImageResponse}
   */
  const guideEntryResponse = (item: GuideImage): GuideImageEntry => {
    const { id, description, imageMap, objects: weightObjects } = item;

    if (!imageMap || !weightObjects)
      throw new InternalServerError('GuideImageEntry: not loaded relationships.');

    const { baseImage, objects } = imageMap;

    if (!baseImage || !objects)
      throw new InternalServerError('GuideImageEntry: not loaded relationships.');

    const weights = weightObjects.reduce((acc, object) => {
      acc[object.imageMapObjectId] = object.weight;
      return acc;
    }, {} as Weights);

    return {
      id,
      description,
      baseImageUrl: `${baseUrl}/${baseImage.path}`,
      objects: mapObjects(objects, weights),
    };
  };

  return { guideListResponse, guideEntryResponse };
};
