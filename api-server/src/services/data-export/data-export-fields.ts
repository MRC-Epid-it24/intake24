import { NutrientTableCsvMappingFieldColumn } from '@/db/models/foods';
import { NutrientType, Scheme, SurveySubmissionFood } from '@/db/models/system';
import { PromptQuestion } from '@common/types';
import { ExportSection, ExportField as BaseExportField } from '@common/types/models';

export type ExportFieldTransform<T = SurveySubmissionFood> = (
  food: T
) => string | number | null | undefined;

export interface ExportField extends BaseExportField {
  value?: string | ExportFieldTransform;
}

export type DataExportFields = Record<ExportSection, (...arg: any[]) => Promise<ExportField[]>>;

export const EMPTY = 'N/A';

export default (): DataExportFields => {
  /**
   * Default survey fields
   *
   * @returns {Promise<ExportField[]>}
   */
  const survey = async (): Promise<ExportField[]> => [
    {
      id: 'id',
      label: 'Submission ID',
      value: (food) => food.meal?.submission?.id,
    },
    {
      id: 'surveyId',
      label: 'Survey ID',
      value: (food) => food.meal?.submission?.surveyId,
    },
    {
      id: 'userId',
      label: 'User ID',
      value: (food) => food.meal?.submission?.userId,
    },
    {
      id: 'userName',
      label: 'Username',
      value: (food) => {
        const aliases = food.meal?.submission?.user?.aliases;
        return aliases && aliases.length ? aliases[0].userName : undefined;
      },
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
  ];

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
   * Survey custom fields
   *
   * @returns {Promise<ExportField[]>}
   */
  const surveyCustom = async (scheme: Scheme): Promise<ExportField[]> => {
    const { preMeals, postMeals, submission } = scheme.questions;
    return [...preMeals, ...postMeals, ...submission].map(customQuestionMapper);
  };

  /**
   * Default meal fields
   *
   * @returns {Promise<ExportField[]>}
   */
  const meal = async (): Promise<ExportField[]> => [
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
  const mealCustom = async (scheme: Scheme): Promise<ExportField[]> => {
    const {
      meals: { preFoods, postFoods },
    } = scheme.questions;
    return [...preFoods, ...postFoods].map(customQuestionMapper);
  };

  /**
   * Default food fields
   *
   * @returns {Promise<ExportField[]>}
   */
  const food = async (): Promise<ExportField[]> => [
    { id: 'code', label: 'Food code', value: 'code' },
    { id: 'englishDescription', label: 'Description (en)', value: 'englishDescription' },
    { id: 'localDescription', label: 'Description (local)', value: 'localDescription' },
    { id: 'readyMeal', label: 'Ready meal', value: 'readyMeal' },
    { id: 'searchTerm', label: 'Search term', value: 'searchTerm' },
    { id: 'reasonableAmount', label: 'Food code', value: 'reasonableAmount' },
    { id: 'foodGroupId', label: 'Food group code', value: 'foodGroupId' },
    {
      id: 'foodGroupEnglishDescription',
      label: 'Food group (en)',
      value: 'foodGroupEnglishDescription',
    },
    {
      id: 'foodGroupLocalDescription',
      label: 'Food group (local)',
      value: 'foodGroupLocalDescription',
    },
    { id: 'brand', label: 'Brand', value: 'brand' },
    { id: 'nutrientTableId', label: 'Nutrient table name', value: 'nutrientTableId' },
    { id: 'nutrientTableCode', label: 'Nutrient table code', value: 'nutrientTableCode' },

    /*
     * Missing food fields
     * - this is actually different record / table
     *
     */
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
  const foodCustom = async (scheme: Scheme): Promise<ExportField[]> =>
    scheme.questions.meals.foods.map(customQuestionMapper);

  /**
   * Default food composition fields
   *
   * @returns {Promise<ExportField[]>}
   */
  const foodFields = async (): Promise<ExportField[]> => {
    const fields = await NutrientTableCsvMappingFieldColumn.findAll();

    const fieldNames = fields.map((field) => field.fieldName);

    return [...new Set(fieldNames)].map((name) => ({ id: name, label: name }));
  };

  /**
   * Default food nutrient fields
   *
   * @returns {Promise<ExportField[]>}
   */
  const foodNutrients = async (): Promise<ExportField[]> => {
    const types = await NutrientType.findAll();

    return types.map((type) => ({ id: type.id.toString(), label: type.description }));
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
