import type { LocaleTranslation } from '@intake24/common/types';
import type {
  AsServedImageEntry,
  AsServedSetEntry,
  AsServedSetListEntry,
  DrinkwareSetEntry,
  DrinkwareSetListEntry,
  GuideImageEntry,
  GuideImageEntryObject,
  GuideImageListEntry,
  ImageMapEntry,
  ImageMapEntryObject,
  ImageMapListEntry,
} from '@intake24/common/types/http/admin';
import type {
  AsServedImage,
  AsServedSet,
  DrinkwareSet,
  GuideImage,
  ImageMap,
  ImageMapObject,
} from '@intake24/db';
import { InternalServerError } from '@intake24/api/http/errors';

type GuideObjects = { [index: string]: { label: LocaleTranslation; weight: number } };

const imageResponseCollection = (baseUrl: string) => {
  /**
   * As served image entry
   *
   * @param {AsServedImage} item
   * @returns {AsServedImageEntry}
   */
  const asServedImageEntryResponse = (item: AsServedImage): AsServedImageEntry => {
    const { id, image, thumbnailImage, weight } = item;

    if (!image || !thumbnailImage)
      throw new InternalServerError(
        'ImageResponseCollection|asServedImages: not loaded relationships.'
      );

    return {
      id,
      mainImageUrl: `${baseUrl}/${image.path}`,
      thumbnailUrl: `${baseUrl}/${thumbnailImage.path}`,
      weight,
    };
  };

  /**
   * As served set list entry
   *
   * @param {AsServedSet} item
   * @returns {AsServedSetListEntry}
   */
  const asServedSetListResponse = (item: AsServedSet): AsServedSetListEntry => {
    const { id, description, selectionImage } = item;

    if (!selectionImage)
      throw new InternalServerError(
        'ImageResponseCollection|asServedSetListResponse: not loaded relationships.'
      );

    return {
      id,
      description,
      imageUrl: `${baseUrl}/${selectionImage.path}`,
    };
  };

  /**
   * As served set entry
   *
   * @param {AsServedSet} item
   * @returns {AsServedSetEntry}
   */
  const asServedSetEntryResponse = (item: AsServedSet): AsServedSetEntry => {
    const { id, description, asServedImages: images, selectionImage } = item;

    if (!selectionImage || !images)
      throw new InternalServerError(
        'ImageResponseCollection|asServedSetEntryResponse: not loaded relationships.'
      );

    return {
      id,
      description,
      selectionImageUrl: `${baseUrl}/${selectionImage.path}`,
      images: images.map(asServedImageEntryResponse),
    };
  };

  /**
   * Drinkware set list entry
   *
   * @param {GuideImage} item
   * @returns {DrinkwareSetListEntry}
   */
  const drinkwareListResponse = (item: DrinkwareSet): DrinkwareSetListEntry => {
    const { id, description, imageMap } = item;

    if (!imageMap || !imageMap.baseImage)
      throw new InternalServerError(
        'ImageResponseCollection|drinkwareListResponse: not loaded relationships.'
      );

    return {
      id,
      description,
      imageUrl: `${baseUrl}/${imageMap.baseImage.path}`,
    };
  };

  const drinkwareEntryResponse = (item: DrinkwareSet): DrinkwareSetEntry => {
    const { id, description, guideImageId, imageMap, scales } = item;

    if (!imageMap || !imageMap.baseImage || !scales)
      throw new InternalServerError(
        'ImageResponseCollection|drinkwareListResponse: not loaded relationships.'
      );

    return {
      id,
      description,
      guideImageId,
      imageUrl: `${baseUrl}/${imageMap.baseImage.path}`,
      scales,
    };
  };

  /**
   * Helper to map image map objects
   *
   * @param {ImageMapObject[]} objects
   * @returns {ImageMapEntryObject[]}
   */
  const mapObjects = (objects: ImageMapObject[]): ImageMapEntryObject[] =>
    objects.map((object) => {
      const { id, description, label, outlineCoordinates } = object;

      return { id, description, label, outlineCoordinates };
    });

  /**
   * Helper to map guide image objects
   *
   * @param {ImageMapObject[]} mapObjects
   * @param {GuideObjects} guideObjects
   * @returns {GuideImageEntryObject[]}
   */
  const guideObjects = (
    mapObjects: ImageMapObject[],
    guideObjects: GuideObjects
  ): GuideImageEntryObject[] =>
    mapObjects.map((object) => {
      const { id, description, outlineCoordinates } = object;
      const { label, weight } = guideObjects[id];

      return { id, description, outlineCoordinates, label, weight };
    });

  /**
   * Guide image list entry
   *
   * @param {GuideImage} item
   * @returns {GuideImageListEntry}
   */
  const guideListResponse = (item: GuideImage): GuideImageListEntry => {
    const { id, description, selectionImage } = item;

    if (!selectionImage)
      throw new InternalServerError(
        'ImageResponseCollection|guideListResponse: not loaded relationships.'
      );

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
    const { id, description, imageMapId, imageMap, objects: guideImageObjects } = item;

    if (!imageMap || !guideImageObjects)
      throw new InternalServerError(
        'ImageResponseCollection|guideEntryResponse: not loaded relationships.'
      );

    const { baseImage, objects: imageMapObjects } = imageMap;

    if (!baseImage || !imageMapObjects)
      throw new InternalServerError(
        'ImageResponseCollection|guideEntryResponse: not loaded relationships.'
      );

    const objects = guideImageObjects.reduce<GuideObjects>(
      (acc, { imageMapObjectId, label, weight }) => {
        acc[imageMapObjectId] = { label, weight };
        return acc;
      },
      {}
    );

    return {
      id,
      description,
      imageMapId,
      baseImageUrl: `${baseUrl}/${baseImage.path}`,
      objects: guideObjects(imageMapObjects, objects),
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

    if (!baseImage)
      throw new InternalServerError(
        'ImageResponseCollection|mapListResponse: not loaded relationships.'
      );

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
      throw new InternalServerError(
        'ImageResponseCollection|mapEntryResponse: not loaded relationships.'
      );

    return {
      id,
      description,
      baseImageUrl: `${baseUrl}/${baseImage.path}`,
      objects: mapObjects(objects),
    };
  };

  return {
    asServedImageEntryResponse,
    asServedSetListResponse,
    asServedSetEntryResponse,
    drinkwareListResponse,
    drinkwareEntryResponse,
    guideListResponse,
    guideEntryResponse,
    mapListResponse,
    mapEntryResponse,
  };
};

export default imageResponseCollection;

export type ImageResponseCollection = ReturnType<typeof imageResponseCollection>;
