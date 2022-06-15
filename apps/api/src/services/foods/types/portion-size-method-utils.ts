import type {
  UserPortionSizeMethod,
  UserPortionSizeMethodParameters,
} from '@intake24/common/types/http/foods/user-food-data';
import type { PortionSizeMethodId } from '@intake24/common/types/models';
import type { CategoryPortionSizeMethod, FoodPortionSizeMethod } from '@intake24/db';
import {
  toUserCategoryPortionSizeMethodParameters,
  toUserPortionSizeMethodParameters,
} from './portion-size-method-parameter-utils';

export interface DatabasePortionSizeMethod {
  method: PortionSizeMethodId;
  description: string;
  imageUrl: string;
  useForRecipes: boolean;
  conversionFactor: number;
  parameters: { name: string; value: string }[];
}

export function toUserPortionSizeMethod(psm: FoodPortionSizeMethod): UserPortionSizeMethod {
  return {
    conversionFactor: psm.conversionFactor,
    description: psm.description,
    imageUrl: psm.imageUrl,
    method: psm.method,
    parameters: psm.parameters ? toUserPortionSizeMethodParameters(psm.parameters) : {},
    useForRecipes: psm.useForRecipes,
  };
}

export function toDatabasePortionSizeMethodParameters(
  userParameters: UserPortionSizeMethodParameters
): { name: string; value: string }[] {
  const parameters: { name: string; value: string }[] = [];

  Object.keys(userParameters).forEach((k) =>
    parameters.push({ name: k, value: userParameters[k] })
  );

  return parameters;
}

export function toDatabasePortionSizeMethod(psm: UserPortionSizeMethod): DatabasePortionSizeMethod {
  return {
    conversionFactor: psm.conversionFactor,
    description: psm.description,
    imageUrl: psm.imageUrl,
    method: psm.method,
    parameters: toDatabasePortionSizeMethodParameters(psm.parameters),
    useForRecipes: psm.useForRecipes,
  };
}

export function toUserCategoryPortionSizeMethod(
  psm: CategoryPortionSizeMethod
): UserPortionSizeMethod {
  return {
    conversionFactor: psm.conversionFactor,
    description: psm.description,
    imageUrl: psm.imageUrl,
    method: psm.method,
    parameters: psm.parameters ? toUserCategoryPortionSizeMethodParameters(psm.parameters) : {},
    useForRecipes: psm.useForRecipes,
  };
}
