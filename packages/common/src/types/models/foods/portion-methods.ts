import type { Optional } from '../../common';
import type { PortionSizeMethodId } from '../../recall';

export type PortionSizeMethodParameterAttributes = {
  id: string;
  portionSizeMethodId: string;
  name: string;
  value: string;
};

export type PortionSizeMethodParameterCreationAttributes = Omit<
  PortionSizeMethodParameterAttributes,
  'id'
>;

export type PortionSizeMethodParameterUpdateAttributes = Optional<
  PortionSizeMethodParameterAttributes,
  'id'
>;

export type PortionSizeMethodAttributes = {
  id: string;
  method: PortionSizeMethodId;
  description: string;
  imageUrl: string;
  useForRecipes: boolean;
  conversionFactor: number;
  orderBy: string;
};

export interface FoodPortionSizeMethodAttributes extends PortionSizeMethodAttributes {
  foodLocalId: string;
}

export interface FoodPortionSizeMethodCreationAttributes
  extends Omit<FoodPortionSizeMethodAttributes, 'id'> {
  parameters?: Omit<PortionSizeMethodParameterCreationAttributes, 'portionSizeMethodId'>[];
}

export interface FoodPortionSizeMethodUpdateAttributes
  extends Optional<FoodPortionSizeMethodAttributes, 'id'> {
  parameters: PortionSizeMethodParameterUpdateAttributes[];
}

export interface CategoryPortionSizeMethodAttributes extends PortionSizeMethodAttributes {
  categoryLocalId: string;
}

export interface CategoryPortionSizeMethodCreationAttributes
  extends Omit<CategoryPortionSizeMethodAttributes, 'id'> {
  parameters?: Omit<PortionSizeMethodParameterCreationAttributes, 'portionSizeMethodId'>[];
}

export interface CategoryPortionSizeMethodUpdateAttributes
  extends Optional<CategoryPortionSizeMethodAttributes, 'id'> {
  parameters: PortionSizeMethodParameterUpdateAttributes[];
}
