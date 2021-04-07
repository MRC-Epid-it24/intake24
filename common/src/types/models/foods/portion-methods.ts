export interface PortionMethodParameters {
  'serving-image-set': string;
  'leftovers-image-set': string;
}

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

export interface PortionSizeMethod {
  // These should all be types themselves
  method: PortionSizeMethodId;
  description: string | null;
  imageUrl: string;
  useForRecipes: boolean;
  conversionFactor: number;
  parameters: PortionMethodParameters;
}
