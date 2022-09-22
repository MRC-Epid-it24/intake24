import type { UserPortionSizeMethodParameters } from '@intake24/common/types/http/foods/user-food-data';
import type {
  CategoryPortionSizeMethodParameter,
  FoodPortionSizeMethodParameter,
} from '@intake24/db';

export function toUserPortionSizeMethodParameters(
  parameters: FoodPortionSizeMethodParameter[]
): [UserPortionSizeMethodParameters, string | undefined] {
  return parameters.reduce<[UserPortionSizeMethodParameters, string | undefined]>(
    (acc, parameter) => {
      const { name, value } = parameter;

      switch (name) {
        case 'serving-image-set':
          // case 'leftovers-image-set':
          acc[1] = parameter.asServedSet?.selectionImage?.path;
          break;
        case 'guide-image-id':
          acc[1] = parameter.guideImage?.selectionImage?.path;
          break;
        default:
          break;
      }

      acc[0][name] = value;

      return acc;
    },
    [{}, undefined]
  );
}

export function toUserCategoryPortionSizeMethodParameters(
  parameters: CategoryPortionSizeMethodParameter[]
): UserPortionSizeMethodParameters {
  return parameters.reduce<UserPortionSizeMethodParameters>((acc, { name, value }) => {
    acc[name] = value;
    return acc;
  }, {});
}
