import type { UserPortionSizeMethodParameters } from '@intake24/common/types/http/foods/user-food-data';
import type {
  CategoryPortionSizeMethodParameter,
  FoodPortionSizeMethodParameter,
} from '@intake24/db';

const transformPortionSizeMethodParameters = (
  acc: [UserPortionSizeMethodParameters, string | undefined],
  parameter: FoodPortionSizeMethodParameter | CategoryPortionSizeMethodParameter
) => {
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
};

export const toUserPortionSizeMethodParameters = (parameters: FoodPortionSizeMethodParameter[]) =>
  parameters.reduce(transformPortionSizeMethodParameters, [{}, undefined]);

export const toUserCategoryPortionSizeMethodParameters = (
  parameters: CategoryPortionSizeMethodParameter[]
) => parameters.reduce(transformPortionSizeMethodParameters, [{}, undefined]);
