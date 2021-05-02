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
  id: number;
  portionSizeMethodId: number;
  name: string;
  value: string;
};

export type PortionSizeMethodParameterCreationAttributes = Omit<
  PortionSizeMethodParameterAttributes,
  'id'
>;

export type PortionSizeMethodAttributes = {
  id: number;
  foodLocalId: number;
  method: PortionSizeMethodId;
  description: string;
  imageUrl: string;
  useForRecipes: boolean;
  conversionFactor: number;
};

export interface PortionSizeMethodCreationAttributes
  extends Omit<PortionSizeMethodAttributes, 'id'> {
  parameters: Omit<PortionSizeMethodParameterCreationAttributes, 'portionSizeMethodId'>[];
}
