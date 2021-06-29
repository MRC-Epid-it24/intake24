import { Includeable } from 'sequelize';
import {
  AsServedImage,
  AsServedSet,
  DrinkwareScale,
  DrinkwareSet,
  DrinkwareVolumeSample,
  GuideImage,
  ImageMap,
} from '@/db/models/foods';
import { NotFoundError } from '@/http/errors';

export interface PortionSizeService {
  getAsServedImage: (asServedSetId: string, id: number | string) => Promise<AsServedImage>;
  getAsServedImages: (
    asServedSetId: string,
    id: number | string | (number | string)[]
  ) => Promise<AsServedImage[]>;
  getAsServedSet: (id: string) => Promise<AsServedSet>;
  getAsServedSets: (id: string | string[]) => Promise<AsServedSet[]>;
  getGuideImage: (id: string) => Promise<GuideImage>;
  getGuideImages: (id: string | string[]) => Promise<GuideImage[]>;
  getImageMap: (id: string) => Promise<ImageMap>;
  getImageMaps: (id: string | string[]) => Promise<ImageMap[]>;
  getDrinkwareSet: (id: string) => Promise<DrinkwareSet>;
  getDrinkwareSets: (id: string | string[]) => Promise<DrinkwareSet[]>;
}

export default (): PortionSizeService => {
  /**
   * Get multiple records of as-served-images data
   *
   * @param {string} asServedSetId
   * @param {(number | string | (number | string)[])} id
   * @returns {Promise<AsServedImage[]>}
   */
  const getAsServedImages = async (
    asServedSetId: string,
    id: number | string | (number | string)[]
  ): Promise<AsServedImage[]> => {
    return AsServedImage.findAll({
      where: { asServedSetId, id },
      order: [['weight', 'ASC']],
      include: [
        { association: 'image', required: true },
        { association: 'thumbnailImage', required: true },
      ],
    });
  };

  /**
   * Get single record of as-served-images data
   *
   * @param {string} asServedSetId
   * @param {(number | string)} id
   * @returns {Promise<AsServedImage>}
   */
  const getAsServedImage = async (
    asServedSetId: string,
    id: number | string
  ): Promise<AsServedImage> => {
    const [asServedImage] = await getAsServedImages(asServedSetId, id);

    if (!asServedImage) throw new NotFoundError('As served image not found.');

    return asServedImage;
  };

  /**
   * Get multiple records of as-served-set data
   *
   * @param {(string | string[])} id
   * @returns {Promise<AsServedSet[]>}
   */
  const getAsServedSets = async (id: string | string[]): Promise<AsServedSet[]> => {
    return AsServedSet.findAll({
      where: { id },
      include: [
        { association: 'selectionImage', required: true },
        {
          association: 'asServedImages',
          order: [['weight', 'ASC']],
          separate: true,
          include: [
            { association: 'image', required: true },
            { association: 'thumbnailImage', required: true },
          ],
        },
      ],
    });
  };

  /**
   * Get single record of as-served-set data
   *
   * @param {string} id
   * @returns {Promise<AsServedSet>}
   */
  const getAsServedSet = async (id: string): Promise<AsServedSet> => {
    const [asServedSet] = await getAsServedSets(id);

    if (!asServedSet) throw new NotFoundError('As served set not found.');

    return asServedSet;
  };

  // Common scope to pull image map for guide image & image map queries
  const imageMapScope: Includeable[] = [
    { association: 'baseImage', required: true },
    {
      association: 'objects',
      order: [['navigationIndex', 'ASC']],
      separate: true,
      include: [{ association: 'overlayImage' }],
    },
  ];

  /**
   * Get multiple records of guide image data
   *
   * @param {(string | string[])} id
   * @returns {Promise<GuideImage[]>}
   */
  const getGuideImages = async (id: string | string[]): Promise<GuideImage[]> => {
    return GuideImage.findAll({
      where: { id },
      include: [
        { association: 'imageMap', required: true, include: imageMapScope },
        { association: 'objects', separate: true },
      ],
    });
  };

  /**
   * Get single record of guide image data
   *
   * @param {string} id
   * @returns {Promise<ImageMap>}
   */
  const getGuideImage = async (id: string): Promise<GuideImage> => {
    const [guideImage] = await getGuideImages(id);

    if (!guideImage) throw new NotFoundError('Guide image not found.');

    return guideImage;
  };

  /**
   * Get multiple records of image map data
   *
   * @param {(string | string[])} id
   * @returns {Promise<ImageMap[]>}
   */
  const getImageMaps = async (id: string | string[]): Promise<ImageMap[]> => {
    return ImageMap.findAll({
      where: { id },
      include: imageMapScope,
    });
  };

  /**
   * Get single record of image map data
   *
   * @param {string} id
   * @returns {Promise<ImageMap>}
   */
  const getImageMap = async (id: string): Promise<ImageMap> => {
    const [imageMap] = await getImageMaps(id);

    if (!imageMap) throw new NotFoundError('Image map not found.');

    return imageMap;
  };

  /**
   * Get multiple records of drinkware data
   *
   * @param {(string | string[])} id
   * @returns {Promise<DrinkwareSet[]>}
   */
  const getDrinkwareSets = async (id: string | string[]): Promise<DrinkwareSet[]> => {
    return DrinkwareSet.findAll({
      where: { id },
      include: [
        {
          model: DrinkwareScale,
          order: [['id', 'ASC']],
          separate: true,
          include: [{ model: DrinkwareVolumeSample, order: [['fill', 'ASC']], separate: true }],
        },
      ],
    });
  };

  /**
   * Get single record of drinkware data
   *
   * @param {string} id
   * @returns {Promise<DrinkwareSet>}
   */
  const getDrinkwareSet = async (id: string): Promise<DrinkwareSet> => {
    const [drinkwareSet] = await getDrinkwareSets(id);

    if (!drinkwareSet) throw new NotFoundError('Drinkware set not found.');

    return drinkwareSet;
  };

  return {
    getAsServedImage,
    getAsServedImages,
    getAsServedSet,
    getAsServedSets,
    getGuideImage,
    getGuideImages,
    getImageMap,
    getImageMaps,
    getDrinkwareSet,
    getDrinkwareSets,
  };
};
