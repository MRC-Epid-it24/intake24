import { CategoryContents } from '@intake24/common/types/http';
import { Category } from '@intake24/db';

const categoriesService = () => {
  const getCategoryContents = async (
    localeId: string,
    categoryCode: string | undefined
  ): Promise<CategoryContents> => {
    return {
      categories: [],
      foods: [],
    };
  };
};

export default categoriesService;

export type CategoriesService = ReturnType<typeof categoriesService>;
