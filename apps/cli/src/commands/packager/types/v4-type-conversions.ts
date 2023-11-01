import type { PkgGlobalFood } from '@intake24/cli/commands/packager/types/foods';
import type { PkgImageMapObject } from '@intake24/cli/commands/packager/types/image-map';
import type { PkgLocale } from '@intake24/cli/commands/packager/types/locale';
import type { UseInRecipeType } from '@intake24/common/types';
import type {
  CreateGlobalFoodRequest,
  CreateLocaleRequest,
  ImageMapEntryObject,
} from '@intake24/common/types/http/admin';
import { useInRecipeTypes } from '@intake24/common/types';

function fromPackageImageMapObjects(
  objects: Record<string, PkgImageMapObject>
): ImageMapEntryObject[] {
  return Object.entries(objects).map(([objId, obj]) => ({
    id: objId,
    description: obj.description,
    navigationIndex: obj.navigationIndex,
    outlineCoordinates: obj.outlineCoordinates,
    label: { en: obj.description },
  }));
}

function fromPackageLocale(locale: PkgLocale): CreateLocaleRequest {
  return {
    code: locale.id,
    localName: locale.localName,
    englishName: locale.englishName,
    adminLanguageId: locale.adminLanguage,
    prototypeLocaleId: locale.prototypeLocale,
    countryFlagCode: locale.flagCode,
    foodIndexLanguageBackendId: 'en',
    respondentLanguageId: locale.respondentLanguage,
    textDirection: locale.textDirection,
  };
}

function validateUseInRecipes(useInRecipes: number | undefined): UseInRecipeType | undefined {
  if (useInRecipes === undefined) return undefined;
  const value = Object.entries(useInRecipeTypes).find((type) => type[1] === useInRecipes);
  if (value === undefined) throw new Error(`Invalid useInRecipes value: ${useInRecipes}`);
  return value[1];
}

function fromPackageGlobalFood(globalFood: PkgGlobalFood): CreateGlobalFoodRequest {
  return {
    code: globalFood.code,
    name: globalFood.englishDescription,
    foodGroupId: globalFood.groupCode.toString(),
    attributes: {
      readyMealOption: globalFood.attributes.readyMealOption,
      reasonableAmount: globalFood.attributes.reasonableAmount,
      sameAsBeforeOption: globalFood.attributes.sameAsBeforeOption,
      useInRecipes: validateUseInRecipes(globalFood.attributes.useInRecipes),
    },
  };
}

export default {
  fromPackageImageMapObjects,
  fromPackageLocale,
  fromPackageGlobalFood,
};
