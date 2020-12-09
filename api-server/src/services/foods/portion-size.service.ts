import { AsServedSet } from '@/db/models/foods';
import { NotFoundError } from '@/http/errors';

export interface PortionSizeService {
  getAsServedSet: (id: string) => Promise<AsServedSet>;
  getAsServedSets: (id: string | string[]) => Promise<AsServedSet[]>;
}

export default (): PortionSizeService => {
  /**
   * Get multiple records of as-served-set with images
   *
   * @param {(string | string[])} id
   * @returns
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
          include: [
            { attributes: ['path'], association: 'image', required: true },
            { attributes: ['path'], association: 'thumbnailImage', required: true },
          ],
        },
      ],
      order: [['asServedImages', 'weight', 'DESC']],
    });

    return asServedSets;
  };

  /**
   * Get single record of as-served-set with images
   *
   * @param {string} id
   * @returns
   */
  const getAsServedSet = async (id: string): Promise<AsServedSet> => {
    const [asServedSet] = await getAsServedSets(id);

    if (!asServedSet) throw new NotFoundError('As served set not found.');

    return asServedSet;
  };

  return {
    getAsServedSet,
    getAsServedSets,
  };
};
