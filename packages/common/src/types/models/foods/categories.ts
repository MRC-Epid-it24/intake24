import { Optional } from '../model';

export type CategoryAttributes = {
  code: string;
  description: string;
  isHidden: boolean;
  version: string;
};

export type CategoryCreationAttributes = Optional<CategoryAttributes, 'isHidden'>;

export type CategoryCategoryAttributes = {
  id: number;
  subcategoryCode: string;
  categoryCode: string;
};

export type CategoryCategoryCreationAttributes = Omit<CategoryCategoryAttributes, 'id'>;
