import type { InheritableAttributes } from '@intake24/api/services/foods/types/inheritable-attributes';
import {
  getCategoryParentCategories,
  getFoodParentCategories,
} from '@intake24/api/services/foods/common';
import { AttributeDefaults, CategoryAttribute, FoodAttribute } from '@intake24/db';

interface InheritableAttributesTemp {
  reasonableAmount: number | null;
  readyMealOption: boolean | null;
  sameAsBeforeOption: boolean | null;
  useInRecipes: number | null;
}

const inheritableAttributesService = () => {
  const completeAttributes = (
    attributes: InheritableAttributesTemp
  ): InheritableAttributes | undefined => {
    if (
      attributes.readyMealOption == null ||
      attributes.reasonableAmount == null ||
      attributes.sameAsBeforeOption == null ||
      attributes.useInRecipes == null
    )
      return undefined;

    return {
      readyMealOption: attributes.readyMealOption,
      sameAsBeforeOption: attributes.sameAsBeforeOption,
      reasonableAmount: attributes.reasonableAmount,
      useInRecipes: attributes.useInRecipes,
    };
  };

  const completeAttributesWithDefaults = async (
    attributes: InheritableAttributesTemp
  ): Promise<InheritableAttributes> => {
    const defaults = await AttributeDefaults.findAll({ limit: 1 });

    if (defaults.length)
      return {
        readyMealOption: attributes.readyMealOption ?? defaults[0].readyMealOption,
        sameAsBeforeOption: attributes.sameAsBeforeOption ?? defaults[0].sameAsBeforeOption,
        reasonableAmount: attributes.reasonableAmount ?? defaults[0].reasonableAmount,
        useInRecipes: attributes.useInRecipes ?? defaults[0].useInRecipes,
      };

    throw new Error(
      "Cannot resolve default inheritable attributes because the 'attributes_defaults' table is empty"
    );
  };

  const resolveInheritableAttributesRec = async (
    parentCategories: string[],
    attributes: InheritableAttributesTemp
  ): Promise<InheritableAttributes> => {
    if (!parentCategories.length) return completeAttributesWithDefaults(attributes);

    const parentAttributesRows = await CategoryAttribute.findAll({
      where: { categoryCode: parentCategories },
      order: [['categoryCode', 'ASC']],
    });

    const newAttributes: InheritableAttributesTemp = {
      readyMealOption: attributes.readyMealOption,
      reasonableAmount: attributes.reasonableAmount,
      sameAsBeforeOption: attributes.sameAsBeforeOption,
      useInRecipes: attributes.useInRecipes,
    };

    for (let i = 0; i < parentAttributesRows.length; ++i) {
      newAttributes.readyMealOption =
        attributes.readyMealOption ?? parentAttributesRows[i].readyMealOption;
      newAttributes.reasonableAmount =
        attributes.reasonableAmount ?? parentAttributesRows[i].reasonableAmount;
      newAttributes.sameAsBeforeOption =
        attributes.sameAsBeforeOption ?? parentAttributesRows[i].sameAsBeforeOption;
      newAttributes.useInRecipes = attributes.useInRecipes ?? parentAttributesRows[i].useInRecipes;
    }

    const maybeComplete = completeAttributes(newAttributes);

    if (maybeComplete) return maybeComplete;

    const nextParents = await getCategoryParentCategories(parentCategories);

    return resolveInheritableAttributesRec(nextParents, newAttributes);
  };

  async function resolveInheritableAttributes(foodCode: string): Promise<InheritableAttributes> {
    const foodAttributesRow = await FoodAttribute.findOne({
      where: { foodCode },
    });

    const attributes: InheritableAttributesTemp = {
      readyMealOption: null,
      reasonableAmount: null,
      sameAsBeforeOption: null,
      useInRecipes: null,
    };

    if (foodAttributesRow) {
      attributes.readyMealOption = foodAttributesRow.readyMealOption;
      attributes.reasonableAmount = foodAttributesRow.reasonableAmount;
      attributes.sameAsBeforeOption = foodAttributesRow.sameAsBeforeOption;
      attributes.useInRecipes = foodAttributesRow.useInRecipes;
    }

    const maybeComplete = completeAttributes(attributes);

    if (maybeComplete) return maybeComplete;

    const parentCategories = await getFoodParentCategories(foodCode);

    return resolveInheritableAttributesRec(parentCategories, attributes);
  }

  return {
    resolveInheritableAttributes,
  };
};

export default inheritableAttributesService;

export type InheritableAttributesService = ReturnType<typeof inheritableAttributesService>;
