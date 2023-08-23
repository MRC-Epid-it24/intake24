import type { IoC } from '@intake24/api/ioc';
import { Category, Food, getAllChildCategories, QueryTypes } from '@intake24/db';

// FIXME: get from config file
const ATTR_CACHE_LIFETIME = 300;

const cachedParentCategoriesService = ({ cache }: Pick<IoC, 'cache'>) => {
  async function getFoodParentCategories(foodCode: string): Promise<string[]> {
    return cache.remember<string[]>(
      `FoodParentCategories.${foodCode}`,
      ATTR_CACHE_LIFETIME,
      async () => {
        const row = await Food.findOne({
          where: { code: foodCode },
          include: [
            {
              association: 'parentCategories',
              attributes: ['code'],
            },
          ],
        });

        if (row === null || row.parentCategories === undefined) return [];
        else return row.parentCategories.map((cat) => cat.code);
      }
    );
  }

  async function getCategoryParentCategories(categoryCode: string): Promise<string[]> {
    return cache.remember<string[]>(
      `CategoryParentCategories.${categoryCode}`,
      ATTR_CACHE_LIFETIME,
      async () => {
        const row = await Category.findOne({
          where: { code: categoryCode },
          include: [
            {
              association: 'parentCategories',
              attributes: ['code'],
            },
          ],
        });

        if (row === null || row.parentCategories === undefined) return [];
        else return row.parentCategories.map((cat) => cat.code);
      }
    );
  }

  async function getFoodAllCategories(foodCode: string): Promise<string[]> {
    return cache.remember<string[]>(
      `FoodAllCategories.${foodCode}`,
      ATTR_CACHE_LIFETIME,
      async () => {
        let nextLevel = await getFoodParentCategories(foodCode);
        const allCategories = new Set<string>();

        while (nextLevel.length > 0) {
          nextLevel.forEach((code) => allCategories.add(code));
          nextLevel = await Promise.all(nextLevel.map(getCategoryParentCategories)).then((x) =>
            x.flat()
          );
        }

        return [...allCategories];
      }
    );
  }

  async function getCategoryAllCategories(categoryCode: string): Promise<string[]> {
    return cache.remember<string[]>(
      `CategoryAllCategories.${categoryCode}`,
      ATTR_CACHE_LIFETIME,
      async () => {
        let nextLevel = await getCategoryParentCategories(categoryCode);
        const allCategories = new Set<string>();

        while (nextLevel.length > 0) {
          nextLevel.forEach((code) => allCategories.add(code));
          nextLevel = await Promise.all(nextLevel.map(getCategoryParentCategories)).then((x) =>
            x.flat()
          );
        }

        return [...allCategories];
      }
    );
  }

  return {
    getFoodParentCategories,
    getCategoryParentCategories,
    getFoodAllCategories,
    getCategoryAllCategories,
  };
};

export default cachedParentCategoriesService;

export type CachedParentCategoriesService = ReturnType<typeof cachedParentCategoriesService>;
