import { orderBy } from 'lodash';
import uaParser from 'ua-parser-js';

import type { PromptQuestion } from '@intake24/common/prompts';
import type { ExportField as BaseExportField } from '@intake24/common/schemes';
import type { SurveyScheme, SurveySubmissionFood } from '@intake24/db';
import { NutrientTableCsvMappingField, SystemNutrientType, UserCustomField } from '@intake24/db';

export type ExportFieldTransform<T = SurveySubmissionFood> = (
  food: T
) => string | number | null | undefined;

export interface ExportField<T = SurveySubmissionFood> extends BaseExportField {
  value?: string | ExportFieldTransform<T>;
}

export const EMPTY = 'N/A';

const dataExportFields = () => {
  /**
   * Helper to map custom PromptQuestion to ExportField
   *
   * @param {PromptQuestion} question
   * @returns {ExportField}
   */
  const customQuestionMapper = ({ id, name: label }: PromptQuestion): ExportField => ({
    id,
    label,
  });

  /**
   * Helper to filter custom PromptQuestion to ExportField
   *
   * @param {PromptQuestion} { type }
   * @returns {boolean}
   */
  const customQuestionFilter = ({ type }: PromptQuestion): boolean => type === 'custom';

  /**
   * Default user fields
   *
   * @returns {Promise<ExportField[]>}
   */
  const user = async (): Promise<ExportField[]> => [
    {
      id: 'userId',
      label: 'User ID',
      value: (food) => food.meal?.submission?.user?.id,
    },
    {
      id: 'email',
      label: 'User Email',
      value: (food) => food.meal?.submission?.user?.email,
    },
    {
      id: 'phone',
      label: 'User Phone',
      value: (food) => food.meal?.submission?.user?.phone,
    },
    {
      id: 'name',
      label: 'User Name',
      value: (food) => food.meal?.submission?.user?.name,
    },
    {
      id: 'simpleName',
      label: 'User Simple Name',
      value: (food) => food.meal?.submission?.user?.simpleName,
    },
    {
      id: 'username',
      label: 'Survey Alias / username',
      value: (food) => {
        const aliases = food.meal?.submission?.user?.aliases;
        return aliases && aliases.length ? aliases[0].username : undefined;
      },
    },
  ];

  /**
   * User custom fields
   *
   * @returns {Promise<ExportField[]>}
   */
  const userCustom = async (): Promise<ExportField[]> => {
    type UserCustomFieldDistinctValue = { DISTINCT: string };
    const records: UserCustomFieldDistinctValue[] = await UserCustomField.aggregate(
      'name',
      'DISTINCT',
      { plain: false }
    );
    const fields = records.map(({ DISTINCT }) => ({ id: DISTINCT, label: DISTINCT }));

    return orderBy(fields, 'id');
  };

  /**
   * Default survey fields
   *
   * @returns {Promise<ExportField[]>}
   */
  const survey = async (): Promise<ExportField[]> => [
    {
      id: 'submissionId',
      label: 'Submission ID',
      value: (food) => food.meal?.submission?.id,
    },
    {
      id: 'surveyId',
      label: 'Survey ID',
      value: (food) => food.meal?.submission?.surveyId,
    },
    {
      id: 'startTime',
      label: 'Start DateTime',
      value: (food) => food.meal?.submission?.startTime?.toString(),
    },
    {
      id: 'endTime',
      label: 'End DateTime',
      value: (food) => food.meal?.submission?.endTime?.toString(),
    },
    {
      id: 'submissionTime',
      label: 'Submission DateTime',
      value: (food) => food.meal?.submission?.submissionTime?.toString(),
    },
    {
      id: 'userAgent',
      label: 'User Agent',
      value: (food) => uaParser(food.meal?.submission?.userAgent ?? undefined).ua,
    },
    {
      id: 'browser',
      label: 'Browser',
      value: (food) => {
        const uaInfo = uaParser(food.meal?.submission?.userAgent ?? undefined);
        return [uaInfo.browser.name, uaInfo.browser.version].filter(Boolean).join(' | ');
      },
    },
    {
      id: 'engine',
      label: 'Engine',
      value: (food) => {
        const uaInfo = uaParser(food.meal?.submission?.userAgent ?? undefined);
        return [uaInfo.engine.name, uaInfo.engine.version].filter(Boolean).join(' | ');
      },
    },
    {
      id: 'device',
      label: 'Device',
      value: (food) => {
        const uaInfo = uaParser(food.meal?.submission?.userAgent ?? undefined);
        return [uaInfo.device.model, uaInfo.device.type, uaInfo.device.vendor]
          .filter(Boolean)
          .join(' | ');
      },
    },
    {
      id: 'os',
      label: 'OS',
      value: (food) => {
        const uaInfo = uaParser(food.meal?.submission?.userAgent ?? undefined);
        return [uaInfo.os.name, uaInfo.os.version].filter(Boolean).join(' | ');
      },
    },
    {
      id: 'cpu',
      label: 'CPU',
      value: (food) => uaParser(food.meal?.submission?.userAgent ?? undefined).cpu.architecture,
    },
  ];

  /**
   * Survey custom fields
   *
   * @returns {Promise<ExportField[]>}
   */
  const surveyCustom = async (surveyScheme: SurveyScheme): Promise<ExportField[]> => {
    const { preMeals, postMeals, submission } = surveyScheme.questions;
    return [...preMeals, ...postMeals, ...submission]
      .filter(customQuestionFilter)
      .map(customQuestionMapper);
  };

  /**
   * Default meal fields
   *
   * @returns {Promise<ExportField[]>}
   */
  const meal = async (): Promise<ExportField[]> => [
    { id: 'mealId', label: 'Meal ID', value: (food) => food.meal?.id },
    { id: 'name', label: 'Meal name', value: (food) => food.meal?.name },
    {
      id: 'time',
      label: 'Meal time',
      value: (food) => (food.meal ? `${food.meal.hours}:${food.meal.minutes}` : undefined),
    },
  ];

  /**
   * Meal custom fields
   *
   * @returns {Promise<ExportField[]>}
   */
  const mealCustom = async (surveyScheme: SurveyScheme): Promise<ExportField[]> => {
    const {
      meals: { preFoods, postFoods },
    } = surveyScheme.questions;

    return [...preFoods, ...postFoods].filter(customQuestionFilter).map(customQuestionMapper);
  };

  /**
   * Default food fields
   *
   * @returns {Promise<ExportField[]>}
   */
  const food = async (): Promise<ExportField[]> => [
    { id: 'foodId', label: 'Food ID', value: 'id' },
    { id: 'code', label: 'Food code', value: 'code' },
    { id: 'englishName', label: 'Name (en)', value: 'englishName' },
    { id: 'localName', label: 'Name (local)', value: 'localName' },
    { id: 'readyMeal', label: 'Ready meal', value: 'readyMeal' },
    { id: 'searchTerm', label: 'Search term', value: 'searchTerm' },
    { id: 'reasonableAmount', label: 'Food code', value: 'reasonableAmount' },
    { id: 'foodGroupId', label: 'Food group code', value: 'foodGroupId' },
    {
      id: 'foodGroupEnglishName',
      label: 'Food group (en)',
      value: 'foodGroupEnglishName',
    },
    {
      id: 'foodGroupLocalName',
      label: 'Food group (local)',
      value: 'foodGroupLocalName',
    },
    { id: 'brand', label: 'Brand', value: 'brand' },
    { id: 'nutrientTableId', label: 'Nutrient table name', value: 'nutrientTableId' },
    { id: 'nutrientTableCode', label: 'Nutrient table code', value: 'nutrientTableCode' },

    /*
     * Missing food fields
     * - this is actually different record / table
     * - TODO: overlapping fields will populate both, e.g. ID
     */
    { id: 'missingId', label: 'Missing ID', value: 'id' },
    { id: 'missingName', label: 'Missing name', value: 'name' },
    { id: 'missingDescription', label: 'Missing description', value: 'description' },
    { id: 'missingPortionSize', label: 'Missing portion size', value: 'portionSize' },
    { id: 'missingLeftovers', label: 'Missing leftovers', value: 'leftovers' },
  ];

  /**
   * Food custom fields
   *
   * @returns {Promise<ExportField[]>}
   */
  const foodCustom = async (surveyScheme: SurveyScheme): Promise<ExportField[]> =>
    surveyScheme.questions.meals.foods.filter(customQuestionFilter).map(customQuestionMapper);

  /**
   * Default food composition fields
   *
   * @returns {Promise<ExportField[]>}
   */
  const foodFields = async (): Promise<ExportField[]> => {
    const fields = await NutrientTableCsvMappingField.findAll();

    const fieldNames = fields.map((field) => field.fieldName);

    return [...new Set(fieldNames)].map((name) => ({ id: name, label: name }));
  };

  /**
   * Default food nutrient fields
   *
   * @returns {Promise<ExportField[]>}
   */
  const foodNutrients = async (): Promise<ExportField[]> => {
    const types = await SystemNutrientType.findAll();

    return types.map((type) => ({ id: type.id, label: type.description }));
  };

  /**
   * Default portion size fields
   * TODO: Pull from DB? labels to translations?
   *
   * @returns {Promise<ExportField[]>}
   */
  const portionSizes = async (): Promise<ExportField[]> => [
    { id: 'bowl', label: 'Bowl' },
    { id: 'bowlIndex', label: 'Bowl Index' },
    { id: 'containerIndex', label: 'Container Idx' },
    { id: 'drinkware-id', label: 'Drinkware ID' },
    { id: 'fillLevel', label: 'Fill Level' },
    { id: 'guide-image-id', label: 'Guide Image ID' },
    { id: 'imageUrl', label: 'Image URL' },
    { id: 'initial-fill-level', label: 'Initial Fill Level' },
    { id: 'leftovers', label: 'Leftovers' },
    { id: 'leftovers-image-set', label: 'Leftovers Image Set' },
    { id: 'leftoversChoiceIndex', label: 'Leftovers Choice Idx' },
    { id: 'leftoversImage', label: 'Leftovers image' },
    { id: 'leftoversLevel', label: 'Leftovers Level' },
    { id: 'leftoversWeight', label: 'Leftovers Weight' },
    { id: 'leftoversWeightFactor', label: 'Leftovers Weight Factor' },
    { id: 'milkLevelChoice', label: 'Milk Level Choice' },
    { id: 'milkLevelImage', label: 'Milk Level Image' },
    { id: 'milkPartIndex', label: 'Milk Part Index' },
    { id: 'milkVolumePercentage', label: 'Milk Volume Percentage' },
    { id: 'objectIndex', label: 'Object Index' },
    { id: 'objectWeight', label: 'Object Weight' },
    {
      id: 'portionWeight',
      label: 'Portion Weight',
      value: (foodEntry) => {
        const servingWeightVal = foodEntry.portionSizes?.find(
          (item) => item.name === 'servingWeight'
        )?.value;
        const leftoversWeightVal = foodEntry.portionSizes?.find(
          (item) => item.name === 'leftoversWeight'
        )?.value;
        if (!servingWeightVal || !leftoversWeightVal) return undefined;

        const servingWeight = parseFloat(servingWeightVal);
        const leftoversWeight = parseFloat(leftoversWeightVal);
        if (Number.isNaN(servingWeight) || Number.isNaN(leftoversWeight)) return undefined;

        return servingWeight - leftoversWeight;
      },
    },
    { id: 'quantity', label: 'Quantity' },
    { id: 'reason', label: 'Reason' },
    { id: 'serving-image-set', label: 'As served Image Set' },
    { id: 'servingChoiceIndex', label: 'As served Choice Index' },
    { id: 'servingImage', label: 'As served Image' },
    { id: 'servingWeight', label: 'As served Weight' },
    { id: 'servingWeightFactor', label: 'As served weight factor' },
    { id: 'skip-fill-level', label: 'Skip Fill Level' },
    { id: 'type', label: 'Type' },
    { id: 'unit-choice', label: 'Unit Choice' },
    { id: 'unit0-name', label: 'unit0-name' },
    { id: 'unit0-omit-food-description', label: 'unit0-omit-food-description' },
    { id: 'unit0-weight', label: 'unit0-weight' },
    { id: 'unit1-name', label: 'unit1-name' },
    { id: 'unit1-omit-food-description', label: 'unit1-omit-food-description' },
    { id: 'unit1-weight', label: 'unit1-weight' },
    { id: 'unit2-name', label: 'unit2-name' },
    { id: 'unit2-omit-food-description', label: 'unit2-omit-food-description' },
    { id: 'unit2-weight', label: 'unit2-weight' },
    { id: 'unit3-name', label: 'unit3-name' },
    { id: 'unit3-omit-food-description', label: 'unit3-omit-food-description' },
    { id: 'unit3-weight', label: 'unit3-weight' },
    { id: 'unit4-name', label: 'unit4-name' },
    { id: 'unit4-omit-food-description', label: 'unit4-omit-food-description' },
    { id: 'unit4-weight', label: 'unit4-weight' },
    { id: 'units-count', label: 'units-count' },
  ];

  return {
    user,
    userCustom,
    survey,
    surveyCustom,
    meal,
    mealCustom,
    food,
    foodCustom,
    foodFields,
    foodNutrients,
    portionSizes,
  };
};

export default dataExportFields;

export type DataExportFields = ReturnType<typeof dataExportFields>;
