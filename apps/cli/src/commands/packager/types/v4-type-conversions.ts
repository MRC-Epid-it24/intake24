import type {
  PkgGlobalCategory,
  PkgLocalCategory,
} from '@intake24/cli/commands/packager/types/categories';
import type {
  PkgAssociatedFood,
  PkgGlobalFood,
  PkgLocalFood,
  PkgPortionSizeMethod,
} from '@intake24/cli/commands/packager/types/foods';
import type { PkgImageMapObject } from '@intake24/cli/commands/packager/types/image-map';
import type { PkgLocale } from '@intake24/cli/commands/packager/types/locale';
import type { PkgNutrientTable } from '@intake24/cli/commands/packager/types/nutrient-tables';
import type { PortionSizeMethod } from '@intake24/common/surveys';
import type { UseInRecipeType } from '@intake24/common/types';
import { useInRecipeTypes } from '@intake24/common/types';
import type {
  CreateGlobalCategoryRequest,
  CreateGlobalFoodRequest,
  CreateLocalCategoryRequest,
  CreateLocalFoodRequest,
  GuideImageInputObject,
  ImageMapEntryObject,
  LocaleRequest,
  NutrientTableRecordRequest,
  NutrientTableRequest,
} from '@intake24/common/types/http/admin';
import type { AssociatedFood } from '@intake24/common/types/http/admin/associated-food';

function fromPackageImageMapObjects(
  objects: Record<string, PkgImageMapObject>,
): ImageMapEntryObject[] {
  return Object.entries(objects).map(([objId, obj]) => ({
    id: objId,
    description: obj.description,
    navigationIndex: obj.navigationIndex,
    outlineCoordinates: obj.outlineCoordinates,
    label: { en: obj.description },
  }));
}

function fromPackageGuideImageObjects(
  objects: Record<number, number>,
): GuideImageInputObject[] {
  return Object.entries(objects).map(([objId, weight]) => ({
    id: objId,
    label: { en: 'No description ' },
    weight,
  }));
}

function fromPackageLocale(locale: PkgLocale): LocaleRequest {
  return {
    code: locale.id,
    localName: locale.localName,
    englishName: locale.englishName,
    adminLanguageId: locale.adminLanguage,
    prototypeLocaleId: locale.prototypeLocale,
    countryFlagCode: locale.flagCode,
    foodIndexLanguageBackendId: locale.foodIndexLanguageBackendId ?? 'en',
    respondentLanguageId: locale.respondentLanguage,
    textDirection: locale.textDirection,
  };
}

function validateUseInRecipes(useInRecipes: number | undefined): UseInRecipeType | undefined {
  if (useInRecipes === undefined)
    return undefined;
  const value = Object.entries(useInRecipeTypes).find(type => type[1] === useInRecipes);
  if (value === undefined)
    throw new Error(`Invalid useInRecipes value: ${useInRecipes}`);
  return value[1];
}

function fromPackageGlobalFood(globalFood: PkgGlobalFood): CreateGlobalFoodRequest {
  return {
    code: globalFood.code,
    name: globalFood.englishDescription,
    foodGroupId: globalFood.groupCode.toString(),
    parentCategories: globalFood.parentCategories,
    attributes: {
      readyMealOption: globalFood.attributes.readyMealOption,
      reasonableAmount: globalFood.attributes.reasonableAmount,
      sameAsBeforeOption: globalFood.attributes.sameAsBeforeOption,
      useInRecipes: validateUseInRecipes(globalFood.attributes.useInRecipes),
    },
  };
}

function fromPackageGlobalCategory(globalCategory: PkgGlobalCategory): CreateGlobalCategoryRequest {
  return {
    code: globalCategory.code,
    name: globalCategory.englishDescription,
    parentCategories: globalCategory.parentCategories,
    isHidden: globalCategory.isHidden,
    attributes: {
      readyMealOption: globalCategory.attributes.readyMealOption,
      reasonableAmount: globalCategory.attributes.reasonableAmount,
      sameAsBeforeOption: globalCategory.attributes.sameAsBeforeOption,
      useInRecipes: validateUseInRecipes(globalCategory.attributes.useInRecipes),
    },
  };
}

function fromPackageAssociatedFood(associatedFood: PkgAssociatedFood): AssociatedFood {
  return {
    foodCode: associatedFood.foodCode,
    categoryCode: associatedFood.categoryCode,
    genericName: associatedFood.genericName,
    linkAsMain: associatedFood.linkAsMain,
    promptText: associatedFood.promptText,
    allowMultiple: false,
  };
}

// V4 types are very similar to pkg types at the moment but better to explicitly map
// them to preserve type safety in case they diverge
function fromPackagePortionSizeMethod(psm: PkgPortionSizeMethod, orderBy: string): PortionSizeMethod {
  const baseFields = {
    description: psm.description,
    conversionFactor: psm.conversionFactor,
    useForRecipes: psm.useForRecipes,
    orderBy,
  };

  switch (psm.method) {
    case 'as-served':
      return {
        ...baseFields,
        method: 'as-served',
        parameters: {
          servingImageSet: psm.servingImageSet,
          leftoversImageSet: psm.leftoversImageSet,
        },
      };
    case 'guide-image':
      return {
        ...baseFields,
        method: 'guide-image',
        parameters: {
          guideImageId: psm.guideImageId,
        },
      };
    case 'drink-scale':
      return {
        ...baseFields,
        method: 'drink-scale',
        parameters: {
          drinkwareId: psm.drinkwareId,
          skipFillLevel: psm.skipFillLevel,
          initialFillLevel: psm.initialFillLevel,
          multiple: psm.multiple,
        },
      };
    case 'standard-portion':
      return {
        ...baseFields,
        method: 'standard-portion',
        parameters: {
          units: psm.units.map(pkgUnit => ({
            name: pkgUnit.name,
            weight: pkgUnit.weight,
            omitFoodDescription: pkgUnit.omitFoodDescription,
            inlineEstimateIn: pkgUnit.inlineEstimateIn,
            inlineHowMany: pkgUnit.inlineHowMany,
          })),
        },
      };
    case 'cereal':
      return {
        ...baseFields,
        method: 'cereal',
        parameters: {
          type: psm.type as 'hoop' | 'flake' | 'rkris',
        },
      };
    case 'milk-in-a-hot-drink':
      return {
        ...baseFields,
        method: 'milk-in-a-hot-drink',
        parameters: {
          options: { en: [] },
        },
      };
    case 'milk-on-cereal':
      return {
        ...baseFields,
        method: 'milk-on-cereal',
        parameters: {},
      };
    case 'pizza':
      return {
        ...baseFields,
        method: 'pizza',
        parameters: {},
      };
    case 'direct-weight':
      return {
        ...baseFields,
        method: 'direct-weight',
        parameters: {},
      };
  }
}

function fromPackageLocalFood(localFood: PkgLocalFood): CreateLocalFoodRequest {
  return {
    code: localFood.code,
    name: localFood.localDescription ?? 'Missing local description!',
    altNames: localFood.alternativeNames,
    tags: localFood.tags,
    associatedFoods: localFood.associatedFoods.map(af => fromPackageAssociatedFood(af)),
    portionSizeMethods: localFood.portionSize.map((psm, idx) => fromPackagePortionSizeMethod(psm, idx.toString())),
    nutrientTableCodes: localFood.nutrientTableCodes,
  };
}

function fromPackageLocalCategory(localCategory: PkgLocalCategory): CreateLocalCategoryRequest {
  return {
    code: localCategory.code,
    version: localCategory.version,
    name: localCategory.localDescription ?? 'Missing description!',
    portionSizeMethods: localCategory.portionSize.map((psm, idx) => fromPackagePortionSizeMethod(psm, idx.toString())),
  };
}

function fromPackageNutrientTable(nutrientTable: PkgNutrientTable): NutrientTableRequest {
  return {
    id: nutrientTable.id,
    description: nutrientTable.description,
    csvMapping: {
      rowOffset: nutrientTable.csvMapping.rowOffset,
      idColumnOffset: nutrientTable.csvMapping.idColumnOffset,
      descriptionColumnOffset: nutrientTable.csvMapping.descriptionColumnOffset,
      localDescriptionColumnOffset: nutrientTable.csvMapping.localDescriptionColumnOffset ?? null,
    },
    csvMappingFields: nutrientTable.csvFieldMapping,
    csvMappingNutrients: nutrientTable.csvNutrientMapping,
  };
}

function fromPackageNutrientTableRecords(nutrientTable: PkgNutrientTable): NutrientTableRecordRequest[] {
  return nutrientTable.records;
}

export default {
  fromPackageImageMapObjects,
  fromPackageGuideImageObjects,
  fromPackageLocale,
  fromPackageGlobalFood,
  fromPackageLocalFood,
  fromPackageGlobalCategory,
  fromPackageLocalCategory,
  fromPackageNutrientTable,
  fromPackageNutrientTableRecords,
};
