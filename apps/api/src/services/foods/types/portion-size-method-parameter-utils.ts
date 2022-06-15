import type { UserPortionSizeMethodParameters } from '@intake24/common/types/http/foods/user-food-data';
import type {
  CategoryPortionSizeMethodParameter,
  FoodPortionSizeMethodParameter,
} from '@intake24/db';

export function toUserPortionSizeMethodParameters(
  parameters: FoodPortionSizeMethodParameter[]
): UserPortionSizeMethodParameters {
  const result: UserPortionSizeMethodParameters = {};

  for (let i = 0; i < parameters.length; ++i) {
    result[parameters[i].name] = parameters[i].value;
  }

  return result;
}

export function toUserCategoryPortionSizeMethodParameters(
  parameters: CategoryPortionSizeMethodParameter[]
): UserPortionSizeMethodParameters {
  const result: UserPortionSizeMethodParameters = {};

  for (let i = 0; i < parameters.length; ++i) {
    result[parameters[i].name] = parameters[i].value;
  }

  return result;
}
