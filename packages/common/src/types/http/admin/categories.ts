import type { Pagination } from '../generic';
import type { FoodListEntry } from './foods';
import { z } from 'zod';
import type { PortionSizeMethod } from '@intake24/common/surveys/portion-size';

import { portionSizeMethodAttributes } from './portion-size-methods';

export type CreateGlobalCategoryRequest = {
  code: string;
  version?: string;
  name: string;
  hidden: boolean;
  parentCategories?: string[];
};

export type UpdateGlobalCategoryRequest = Omit<CreateGlobalCategoryRequest, 'code' | 'version'>;

export type GlobalCategoryEntry = {
  code: string;
  name: string;
  version: string;
};

export type CreateCategoryRequest = {
  code: string;
  englishName: string;
  name: string;
  hidden: boolean;
  tags?: string[];
  excludeTags?: string[];
  version?: string;
  parentCategories?: string[];
  portionSizeMethods: PortionSizeMethod[];
};

export type UpdateCategoryRequest = Omit<CreateCategoryRequest, 'code' | 'version'>;

export type SimpleCategoryEntry = {
  id: string;
  code: string;
  localeId: string;
  version: string;
  name: string;
  portionSizeMethods: PortionSizeMethod[];
};

export const categoryAttributes = z.object({
  id: z.string(),
  code: z.string().min(1).max(32),
  localeId: z.string().min(1).max(16),
  englishName: z.string().min(1).max(256),
  name: z.string().min(1).max(256),
  simpleName: z.string().nullish(),
  hidden: z.boolean(),
  tags: z.string().array(),
  excludeTags: z.string().array(),
  version: z.string().uuid(),
});
export type CategoryAttributes = z.infer<typeof categoryAttributes>;

export const categoryInput = categoryAttributes.omit({
  id: true,
  localeId: true,
  simpleName: true,
}).partial({
  tags: true,
  excludeTags: true,
  version: true,
}).extend({
  parentCategories: categoryAttributes.pick({ id: true }).array(),
  portionSizeMethods: portionSizeMethodAttributes.partial({ id: true, categoryId: true }).array(),
});
export type CategoryInput = z.infer<typeof categoryInput>;

export const categoryCopyInput = categoryAttributes.pick({
  code: true,
  name: true,
});
export type CategoryCopyInput = z.infer<typeof categoryCopyInput>;

export const categoryListEntry = categoryAttributes.pick({
  id: true,
  code: true,
  localeId: true,
  name: true,
  englishName: true,
  hidden: true,
});
export type CategoryListEntry = z.infer<typeof categoryListEntry>;

export type CategoriesResponse = Pagination<CategoryListEntry>;

export type MainCategoriesResponse = Pagination<CategoryAttributes>;

export type RootCategoriesResponse = CategoryListEntry[];

export type CategoryContentsResponse = {
  categories: CategoryListEntry[];
  foods: FoodListEntry[];
};

export type CategoryEntry = CategoryAttributes & {
  parentCategories?: CategoryAttributes[];
};
