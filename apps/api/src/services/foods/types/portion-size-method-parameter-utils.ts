import { UserPortionSizeMethodParameters } from '@common/types/http/foods/user-food-data';
import { CategoryPortionSizeMethodParameter, FoodPortionSizeMethodParameter } from '@api/db';

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
