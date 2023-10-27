import type { PortionSizeMethodId } from '@intake24/common/types';
import type {
  UserPortionSizeMethod,
  UserPortionSizeMethodParameters,
} from '@intake24/common/types/http/foods/user-food-data';
import type { CategoryPortionSizeMethod, FoodPortionSizeMethod } from '@intake24/db';

import { toUserPortionSizeMethodParameters } from './portion-size-method-parameter-utils';

export interface DatabasePortionSizeMethod {
  method: PortionSizeMethodId;
  description: string;
  imageUrl: string;
  useForRecipes: boolean;
  conversionFactor: number;
  orderBy: string;
  parameters: { name: string; value: string }[];
}

export function toUserPortionSizeMethod(
  psm: CategoryPortionSizeMethod | FoodPortionSizeMethod
): UserPortionSizeMethod {
  const [parameters, imageUrl] = psm.parameters
    ? toUserPortionSizeMethodParameters(psm.parameters)
    : [{}, undefined];

  return {
    conversionFactor: psm.conversionFactor,
    description: psm.description,
    imageUrl: imageUrl ?? psm.imageUrl,
    method: psm.method,
    parameters,
    useForRecipes: psm.useForRecipes,
    orderBy: psm.orderBy,
  };
}

export function toDatabasePortionSizeMethodParameters(
  userParameters: UserPortionSizeMethodParameters
): { name: string; value: string }[] {
  return Object.entries(userParameters).map(([name, value]) => ({ name, value }));
}

export function toDatabasePortionSizeMethod(psm: UserPortionSizeMethod): DatabasePortionSizeMethod {
  return {
    conversionFactor: psm.conversionFactor,
    description: psm.description,
    imageUrl: psm.imageUrl,
    method: psm.method,
    parameters: toDatabasePortionSizeMethodParameters(psm.parameters),
    useForRecipes: psm.useForRecipes,
    orderBy: psm.orderBy,
  };
}
