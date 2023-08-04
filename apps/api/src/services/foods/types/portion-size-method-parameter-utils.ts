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

  /*
   * Fetch through separate API
   * Could include directly, but would be better to have locale info at this moment not to fetch all locales
   *
   */
  /* if (name.match(/unit\d{1}-name/) && parameter.standardUnit) {
    const {
      standardUnit: { howMany, estimateIn },
    } = parameter;

    acc[0][name] = value;
    acc[0][name.replace('-name', '-estimateIn')] = estimateIn;
    acc[0][name.replace('-name', '-howMany')] = howMany;
    return acc;
  }
  */

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

export const toUserPortionSizeMethodParameters = (parameters: FoodPortionSizeMethodParameter[]) =>
  parameters.reduce(transformPortionSizeMethodParameters, [{}, undefined]);

export const toUserCategoryPortionSizeMethodParameters = (
  parameters: CategoryPortionSizeMethodParameter[]
) => parameters.reduce(transformPortionSizeMethodParameters, [{}, undefined]);
