import { GuideImage, ImageMap, ImageMapObject } from '@/db/models/foods';
import { InternalServerError } from '@/http/errors';
import {
  GuideImageEntry,
  GuideImageEntryObject,
  GuideImageListEntry,
  ImageMapEntry,
  ImageMapListEntry,
  ImageMapEntryObject,
} from '@common/types/http/admin';

export interface ImageResponseCollection {
  guideListResponse: (item: GuideImage) => GuideImageListEntry;
  guideEntryResponse: (item: GuideImage) => GuideImageEntry;
  mapListResponse: (item: ImageMap) => ImageMapListEntry;
  mapEntryResponse: (item: ImageMap) => ImageMapEntry;
}

type Weights = { [index: number]: number };

export default (baseUrl: string): ImageResponseCollection => {
  const mapObjects = (objects: ImageMapObject[]): ImageMapEntryObject[] => {
    return objects.map((object) => {
      const { id, description, outlineCoordinates, overlayImage } = object;

      if (!overlayImage)
        throw new InternalServerError('ImageMapEntryObject: not loaded relationships.');

      return {
        id,
        description,
        outlineCoordinates,
        overlayUrl: `${baseUrl}/${overlayImage.path}`,
      };
    });
  };

  const guideObjects = (objects: ImageMapObject[], weights: Weights): GuideImageEntryObject[] => {
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
   * @returns {GuideImageListEntry}
   */
  const guideListResponse = (item: GuideImage): GuideImageListEntry => {
    const { id, description, selectionImage } = item;

    if (!selectionImage)
      throw new InternalServerError('GuideImageListEntry: not loaded relationships.');

    return {
      id,
      description,
      imageUrl: `${baseUrl}/${selectionImage.path}`,
    };
  };

  /**
   * Guide image entry
   *
   * @param {GuideImage} item
   * @returns {GuideImageEntry}
   */
  const guideEntryResponse = (item: GuideImage): GuideImageEntry => {
    const { id, description, imageMapId, imageMap, objects: weightObjects } = item;

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
      imageMapId,
      baseImageUrl: `${baseUrl}/${baseImage.path}`,
      objects: guideObjects(objects, weights),
    };
  };

  /**
   * Image map list entry
   *
   * @param {ImageMap} item
   * @returns {ImageMapListEntry}
   */
  const mapListResponse = (item: ImageMap): ImageMapListEntry => {
    const { id, description, baseImage } = item;

    if (!baseImage) throw new InternalServerError('ImageMapListEntry: not loaded relationships.');

    return {
      id,
      description,
      imageUrl: `${baseUrl}/${baseImage.path}`,
    };
  };

  /**
   * Image map entry
   *
   * @param {ImageMap} item
   * @returns {ImageMapEntry}
   */
  const mapEntryResponse = (item: ImageMap): ImageMapEntry => {
    const { id, description, baseImage, objects } = item;

    if (!baseImage || !objects)
      throw new InternalServerError('ImageMapEntry: not loaded relationships.');

    return {
      id,
      description,
      baseImageUrl: `${baseUrl}/${baseImage.path}`,
      objects: mapObjects(objects),
    };
  };

  return { guideListResponse, guideEntryResponse, mapListResponse, mapEntryResponse };
};
