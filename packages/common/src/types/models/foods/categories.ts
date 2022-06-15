import type { CategoryAttributeAttributes } from './attributes';
import type { Optional } from '../model';

export type CategoryAttributes = {
  code: string;
  name: string;
  isHidden: boolean;
  version: string;
};

export type CategoryAssociations = {
  attributes?: CategoryAttributeAttributes;
  parentCategories?: CategoryAttributes[];
};

export type CategoryCreationAttributes = Optional<CategoryAttributes, 'isHidden'>;

export type CategoryCategoryAttributes = {
  subcategoryCode: string;
  categoryCode: string;
};

export type CategoryLocalAttributes = {
  id: string;
  categoryCode: string;
  localeId: string;
  name: string | null;
  simpleName: string | null;
  version: string;
};

export type CategoryLocalCreationAttributes = Omit<CategoryLocalAttributes, 'id'>;
