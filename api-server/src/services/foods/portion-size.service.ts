import { Includeable } from 'sequelize';
import {
  AsServedSet,
  DrinkwareScale,
  DrinkwareSet,
  DrinkwareVolumeSample,
  GuideImage,
  ImageMap,
} from '@/db/models/foods';
import { NotFoundError } from '@/http/errors';

export interface PortionSizeService {
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
   * Get multiple records of as-served-set data
   *
   * @param {(string | string[])} id
   * @returns {Promise<AsServedSet[]>}
   */
  const getAsServedSets = async (id: string | string[]): Promise<AsServedSet[]> => {
    const asServedSets = await AsServedSet.findAll({
      where: { id },
      include: [
        { association: 'selectionImage', required: true },
        {
          association: 'asServedImages',
          order: [['weight', 'DESC']],
          separate: true,
          include: [
            { association: 'image', required: true },
            { association: 'thumbnailImage', required: true },
          ],
        },
      ],
    });

    return asServedSets;
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
    const guideImages = await GuideImage.findAll({
      where: { id },
      include: [
        { association: 'imageMap', required: true, include: imageMapScope },
        { association: 'objects', separate: true },
      ],
    });

    return guideImages;
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
    const imageMaps = await ImageMap.findAll({
      where: { id },
      include: imageMapScope,
    });

    return imageMaps;
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
    const drinkwareSets = await DrinkwareSet.findAll({
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

    return drinkwareSets;
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
