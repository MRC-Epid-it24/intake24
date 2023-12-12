import type { CategoryAttributes } from '@intake24/db';

export interface CategoryListItem extends Pick<CategoryAttributes, 'code' | 'name'> {
  [key: string]: any;
}
