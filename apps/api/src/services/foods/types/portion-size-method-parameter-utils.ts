import type { UserPortionSizeMethodParameters } from '@intake24/common/types/http';
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
    case 'drinkware-id':
      acc[1] = parameter.drinkwareSet?.imageMap?.baseImage?.path;
      break;
    case 'guide-image-id':
      acc[1] = parameter.guideImage?.selectionImage?.path;
      break;
    default:
      break;
  }

  try {
    acc[0][name] = JSON.parse(value);
  } catch {
    acc[0][name] = value;
  }

  return acc;
};

export const toUserPortionSizeMethodParameters = (
  parameters: (CategoryPortionSizeMethodParameter | FoodPortionSizeMethodParameter)[]
) => parameters.reduce(transformPortionSizeMethodParameters, [{}, undefined]);
