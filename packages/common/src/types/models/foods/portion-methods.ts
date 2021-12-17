export type PortionSizeMethodId =
  | 'as-served'
  | 'guide-image'
  | 'drink-scale'
  | 'standard-portion'
  | 'cereal'
  | 'milk-on-cereal'
  | 'pizza'
  | 'milk-in-a-hot-drink'
  | 'weight';

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

export type PortionSizeMethodAttributes = {
  id: string;
  method: PortionSizeMethodId;
  description: string;
  imageUrl: string;
  useForRecipes: boolean;
  conversionFactor: number;
};

export interface FoodPortionSizeMethodAttributes extends PortionSizeMethodAttributes {
  foodLocalId: string;
}

export interface FoodPortionSizeMethodCreationAttributes
  extends Omit<FoodPortionSizeMethodAttributes, 'id'> {
  parameters: Omit<PortionSizeMethodParameterCreationAttributes, 'portionSizeMethodId'>[];
}

export interface CategoryPortionSizeMethodAttributes extends PortionSizeMethodAttributes {
  categoryLocalId: string;
}

export interface CategoryPortionSizeMethodCreationAttributes
  extends Omit<CategoryPortionSizeMethodAttributes, 'id'> {
  parameters: Omit<PortionSizeMethodParameterCreationAttributes, 'portionSizeMethodId'>[];
}
