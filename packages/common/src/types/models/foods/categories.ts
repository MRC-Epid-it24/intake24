import { Optional } from '../model';

export type CategoryAttributes = {
  code: string;
  description: string;
  isHidden: boolean;
  version: string;
};

export type CategoryCreationAttributes = Optional<CategoryAttributes, 'isHidden'>;

export type CategoryCategoryAttributes = {
  subcategoryCode: string;
  categoryCode: string;
};

export type CategoryCategoryCreationAttributes = Omit<CategoryCategoryAttributes, 'id'>;

export type CategoryLocalAttributes = {
  id: string;
  categoryCode: string;
  localeId: string;
  localDescription: string | null;
  simpleLocalDescription: string | null;
  version: string;
};

export type CategoryLocalCreationAttributes = Omit<CategoryLocalAttributes, 'id'>;
