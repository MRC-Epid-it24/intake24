import { FoodLocal, PortionSizeMethod, PortionSizeMethodParameter } from '@/db/models/foods';
import { NotFoundError } from '@/http/errors';

export interface FoodDataService {
  getFoodLocal: (localId: string, foodCode: string) => Promise<FoodLocal>;
}

export default (): FoodDataService => {
  /**
   *
   * Get food date corresponidng to locale and food code from the FoodLocale
   *
   * @param {string} localeId
   * @param {string} foodCode
   * @returns {Promise<FoodLocal>}
   */
  const getFoodLocal = async (localeId: string, foodCode: string): Promise<FoodLocal> => {
    const food = await FoodLocal.findOne({
      where: { localeId, foodCode },
      include: [
        {
          model: PortionSizeMethod,
          as: 'portionSizeMethods',
          attributes: ['method', 'description', 'imageUrl', 'useForRecipes', 'conversionFactor'],
          include: [
            {
              model: PortionSizeMethodParameter,
              as: 'parameters',
              attributes: ['name', 'value'],
            },
          ],
        },
      ],
    });

    if (!food || food == null) throw new NotFoundError();

    return food;
  };

  return {
    getFoodLocal,
  };
};
