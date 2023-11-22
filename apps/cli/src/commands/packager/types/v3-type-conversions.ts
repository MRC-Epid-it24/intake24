import { identity } from 'lodash';

import type {
  AssociatedFoodWithHeaderV3,
  CategoryHeaderV3,
  FoodHeaderV3,
  LocalCategoryRecordV3,
  LocaleV3,
  LocalFoodRecordV3,
  MainCategoryRecordV3,
  MainFoodRecordV3,
  PortableAsServedSetV3,
  PortableDrinkwareSetV3,
  PortionSizeMethodParameterV3,
  PortionSizeMethodV3,
} from '@intake24/api-client-v3';
import type { PkgAsServedSet } from '@intake24/cli/commands/packager/types/as-served';
import type {
  PkgGlobalCategory,
  PkgLocalCategory,
} from '@intake24/cli/commands/packager/types/categories';
import type { PkgDrinkwareSet } from '@intake24/cli/commands/packager/types/drinkware';
import type {
  PkgAsServedPsm,
  PkgAssociatedFood,
  PkgCerealPsm,
  PkgDrinkScalePsm,
  PkgGlobalFood,
  PkgGuideImagePsm,
  PkgLocalFood,
  PkgMilkInHotDrinkPsm,
  PkgMilkOnCerealPsm,
  PkgPizzaPsm,
  PkgPortionSizeMethod,
  PkgPortionSizeMethodType,
  PkgStandardPortionPsm,
  PkgStandardUnit,
} from '@intake24/cli/commands/packager/types/foods';
import type { PkgLocale } from '@intake24/cli/commands/packager/types/locale';
import { PortionSizeMethodTypes } from '@intake24/cli/commands/packager/types/foods';

// JSON encoding for Scala's Option type
// Empty array for None, array with a single element for Some
function parseOption<T>(encoded: T[]): T | null {
  switch (encoded.length) {
    case 0:
      return null;
    case 1:
      return encoded[0];
    default:
      throw new Error('Unexpected Option type format: array has more than one element');
  }
}

// JSON encoding for Scala's Either type
// Array of two elements, arr[0] is either 0 or 1
// if arr[0] is 0, then arr[1] is of type T1
// if arr[0] is 1, then arr[1] is of type T2
//
// constructor functions are required to differentiate between Left and Right
// options in TypeScript in case T1 = T2 (e.g, Either[String, String])
function parseEither<T1, T2, L, R>(
  encoded: [number, T1 | T2],
  consLeft: (val: T1) => L = identity,
  consRight: (val: T2) => R = identity
): L | R {
  if (encoded.length !== 2)
    throw new Error('Unexpected Either type format: array must have exactly two elements');
  switch (encoded[0]) {
    case 0:
      return consLeft(encoded[1] as T1);
    case 1:
      return consRight(encoded[1] as T2);
    default:
      throw new Error(
        'Unexpected Either type format: first element of array must be either 0 or 1'
      );
  }
}

function isValidPortionSizeMethod(method: string): method is PkgPortionSizeMethodType {
  return (PortionSizeMethodTypes as readonly string[]).includes(method);
}

function getPsmParameter(name: string, parameters: PortionSizeMethodParameterV3[]): string {
  const param = getOptionalPsmParameter(name, parameters);

  if (param === undefined)
    throw new Error(`Required portion size method parameter '${name}' not found`);

  return param;
}

function getOptionalPsmParameter(
  name: string,
  parameters: PortionSizeMethodParameterV3[]
): string | undefined {
  return parameters.find((param) => param.name === name)?.value;
}

function parseStandardUnits(parameters: PortionSizeMethodParameterV3[]): PkgStandardUnit[] {
  const unitsCount = parseInt(getPsmParameter('units-count', parameters));

  const units: PkgStandardUnit[] = [];

  for (let i = 0; i < unitsCount; ++i) {
    const name = getPsmParameter(`unit${i}-name`, parameters);
    const weight = parseFloat(getPsmParameter(`unit${i}-weight`, parameters));
    const omitFoodDescription =
      getPsmParameter(`unit${i}-omit-food-description`, parameters) === 'true';

    units.push({
      name,
      weight,
      omitFoodDescription,
    });
  }

  return units;
}

type AssociatedFoodPartial = {
  food?: string;
  category?: string;
};

function parseAssociatedFoodOrCategory(
  foodOrCategory: [number, FoodHeaderV3 | CategoryHeaderV3]
): AssociatedFoodPartial {
  return parseEither(
    foodOrCategory,
    (foodHeader) => ({ food: foodHeader.code }),
    (categoryHeader) => ({ category: categoryHeader.code })
  );
}

function parseTextDirection(direction: string): 'rtl' | 'ltr' {
  switch (direction) {
    case 'rtl':
    case 'ltr':
      return direction;
    default:
      throw new Error(`Unexpected text direction value: ${direction}, expected 'rtl' or 'ltr'`);
  }
}

function packageAsServedSet(set: PortableAsServedSetV3): PkgAsServedSet {
  return {
    id: set.id,
    description: set.description,
    selectionImagePath: set.selectionSourcePath,
    images: set.images.map((image) => ({
      imagePath: image.sourcePath,
      imageKeywords: image.sourceKeywords,
      weight: image.weight,
    })),
  };
}

function packageLocale(locale: LocaleV3): PkgLocale {
  return {
    id: locale.id,
    englishName: locale.englishName,
    localName: locale.localName,
    prototypeLocale: parseOption(locale.prototypeLocale),
    adminLanguage: locale.adminLanguage,
    respondentLanguage: locale.respondentLanguage,
    textDirection: parseTextDirection(locale.textDirection),
    flagCode: locale.flagCode,
  };
}

function packageAssociatedFood(assocFood: AssociatedFoodWithHeaderV3): PkgAssociatedFood {
  return {
    ...parseAssociatedFoodOrCategory(assocFood.foodOrCategoryHeader),
    genericName: assocFood.genericName,
    promptText: assocFood.promptText,
    linkAsMain: assocFood.linkAsMain,
  };
}

function packageAsServed(portionSize: PortionSizeMethodV3): PkgAsServedPsm {
  return {
    method: 'as-served',
    description: portionSize.description,
    conversionFactor: portionSize.conversionFactor,
    useForRecipes: portionSize.useForRecipes,
    servingImageSet: getPsmParameter('serving-image-set', portionSize.parameters),
    leftoversImageSet: getOptionalPsmParameter('leftovers-image-set', portionSize.parameters),
  };
}

function packageGuideImage(portionSize: PortionSizeMethodV3): PkgGuideImagePsm {
  return {
    method: 'guide-image',
    description: portionSize.description,
    conversionFactor: portionSize.conversionFactor,
    useForRecipes: portionSize.useForRecipes,
    guideImageId: getPsmParameter('guide-image-id', portionSize.parameters),
  };
}

function packageDrinkScale(portionSize: PortionSizeMethodV3): PkgDrinkScalePsm {
  return {
    method: 'drink-scale',
    description: portionSize.description,
    conversionFactor: portionSize.conversionFactor,
    useForRecipes: portionSize.useForRecipes,
    drinkwareId: getPsmParameter('drinkware-id', portionSize.parameters),
    initialFillLevel: parseFloat(getPsmParameter('initial-fill-level', portionSize.parameters)),
    skipFillLevel: getPsmParameter('skip-fill-level', portionSize.parameters) === 'true',
  };
}

function packageStandardPortion(portionSize: PortionSizeMethodV3): PkgStandardPortionPsm {
  return {
    method: 'standard-portion',
    description: portionSize.description,
    conversionFactor: portionSize.conversionFactor,
    useForRecipes: portionSize.useForRecipes,
    units: parseStandardUnits(portionSize.parameters),
  };
}

function packageCereal(portionSize: PortionSizeMethodV3): PkgCerealPsm {
  return {
    method: 'cereal',
    description: portionSize.description,
    conversionFactor: portionSize.conversionFactor,
    useForRecipes: portionSize.useForRecipes,
    type: getPsmParameter('type', portionSize.parameters),
  };
}

function packageMilkOnCereal(portionSize: PortionSizeMethodV3): PkgMilkOnCerealPsm {
  return {
    method: 'milk-on-cereal',
    description: portionSize.description,
    conversionFactor: portionSize.conversionFactor,
    useForRecipes: portionSize.useForRecipes,
  };
}

function packagePizza(portionSize: PortionSizeMethodV3): PkgPizzaPsm {
  return {
    method: 'pizza',
    description: portionSize.description,
    conversionFactor: portionSize.conversionFactor,
    useForRecipes: portionSize.useForRecipes,
  };
}

function packageMilkInHotDrink(portionSize: PortionSizeMethodV3): PkgMilkInHotDrinkPsm {
  return {
    method: 'milk-in-a-hot-drink',
    description: portionSize.description,
    conversionFactor: portionSize.conversionFactor,
    useForRecipes: portionSize.useForRecipes,
  };
}

function packagePortionSize(portionSize: PortionSizeMethodV3): PkgPortionSizeMethod {
  if (!isValidPortionSizeMethod(portionSize.method)) {
    throw new Error(`Unexpected portion size estimation method: ${portionSize.method}`);
  }

  switch (portionSize.method) {
    case 'as-served':
      return packageAsServed(portionSize);
    case 'guide-image':
      return packageGuideImage(portionSize);
    case 'drink-scale':
      return packageDrinkScale(portionSize);
    case 'standard-portion':
      return packageStandardPortion(portionSize);
    case 'cereal':
      return packageCereal(portionSize);
    case 'milk-on-cereal':
      return packageMilkOnCereal(portionSize);
    case 'pizza':
      return packagePizza(portionSize);
    case 'milk-in-a-hot-drink':
      return packageMilkInHotDrink(portionSize);
  }
}

function packageLocalFood(code: string, localFood: LocalFoodRecordV3): PkgLocalFood {
  return {
    code,
    version: localFood.version ?? undefined,
    localDescription:
      localFood.localDescription.length === 1 ? localFood.localDescription[0] : undefined,
    associatedFoods: localFood.associatedFoods.map(packageAssociatedFood),
    brandNames: localFood.brandNames,
    nutrientTableCodes: localFood.nutrientTableCodes,
    portionSize: localFood.portionSize.map(packagePortionSize),
  };
}

function packageGlobalFood(mainFood: MainFoodRecordV3): PkgGlobalFood {
  return {
    code: mainFood.code,
    englishDescription: mainFood.englishDescription,
    version: mainFood.version,
    groupCode: mainFood.groupCode,
    parentCategories: mainFood.parentCategories.map((header) => header.code),
    attributes: {
      readyMealOption: parseOption(mainFood.attributes.readyMealOption) ?? undefined,
      reasonableAmount: parseOption(mainFood.attributes.reasonableAmount) ?? undefined,
      sameAsBeforeOption: parseOption(mainFood.attributes.sameAsBeforeOption) ?? undefined,
      useInRecipes: parseOption(mainFood.attributes.useInRecipes) ?? undefined,
    },
  };
}

function packageLocalCategory(
  code: string,
  localCategory: LocalCategoryRecordV3
): PkgLocalCategory {
  return {
    code,
    version: localCategory.version ?? undefined,
    localDescription:
      localCategory.localDescription.length === 1 ? localCategory.localDescription[0] : undefined,
    portionSize: localCategory.portionSize.map(packagePortionSize),
  };
}

function packageGlobalCategory(mainCategory: MainCategoryRecordV3): PkgGlobalCategory {
  return {
    code: mainCategory.code,
    englishDescription: mainCategory.englishDescription,
    version: mainCategory.version,
    isHidden: mainCategory.isHidden,
    parentCategories: mainCategory.parentCategories.map((header) => header.code),
    attributes: {
      readyMealOption: parseOption(mainCategory.attributes.readyMealOption) ?? undefined,
      reasonableAmount: parseOption(mainCategory.attributes.reasonableAmount) ?? undefined,
      sameAsBeforeOption: parseOption(mainCategory.attributes.sameAsBeforeOption) ?? undefined,
      useInRecipes: parseOption(mainCategory.attributes.useInRecipes) ?? undefined,
    },
  };
}

function packageDrinkwareSet(drinkwareSet: PortableDrinkwareSetV3): PkgDrinkwareSet {
  return {
    description: drinkwareSet.description,
    selectionImageMapId: drinkwareSet.selectionImageMapId,
    scales: drinkwareSet.scales,
  };
}

export default {
  packageLocalFood,
  packageGlobalFood,
  packageLocalCategory,
  packageGlobalCategory,
  packageLocale,
  packageAsServedSet,
  packageDrinkwareSet,
};
