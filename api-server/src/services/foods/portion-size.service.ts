import {
  AsServedSet,
  DrinkwareScale,
  DrinkwareSet,
  DrinkwareVolumeSample,
} from '@/db/models/foods';
import { NotFoundError } from '@/http/errors';

export interface PortionSizeService {
  getAsServedSet: (id: string) => Promise<AsServedSet>;
  getAsServedSets: (id: string | string[]) => Promise<AsServedSet[]>;
  getDrinkwareSet: (id: string) => Promise<DrinkwareSet>;
  getDrinkwareSets: (id: string | string[]) => Promise<DrinkwareSet[]>;
}

export default (): PortionSizeService => {
  /**
   * Get multiple records of as-served-set portion size data
   *
   * @param {(string | string[])} id
   * @returns {Promise<AsServedSet[]>}
   */
  const getAsServedSets = async (id: string | string[]): Promise<AsServedSet[]> => {
    const asServedSets = await AsServedSet.findAll({
      attributes: ['id', 'description'],
      where: { id },
      include: [
        { association: 'selectionImage', required: true },
        {
          attributes: ['weight'],
          association: 'asServedImages',
          order: [['weight', 'DESC']],
          separate: true,
          include: [
            { attributes: ['path'], association: 'image', required: true },
            { attributes: ['path'], association: 'thumbnailImage', required: true },
          ],
        },
      ],
    });

    return asServedSets;
  };

  /**
   * Get single record of as-served-set portion size data
   *
   * @param {string} id
   * @returns {Promise<AsServedSet>}
   */
  const getAsServedSet = async (id: string): Promise<AsServedSet> => {
    const [asServedSet] = await getAsServedSets(id);

    if (!asServedSet) throw new NotFoundError('As served set not found.');

    return asServedSet;
  };

  /**
   * Get multiple records of drinkware portion size data
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
   * Get single record of drinkware portion size data
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
    getDrinkwareSet,
    getDrinkwareSets,
  };
};
