import json2csv from 'json2csv';
import { LocalNutrientType, NutrientType, SurveySubmissionFood } from '@/db/models/system';

export type ExportSection =
  | 'survey'
  | 'surveyCustom'
  | 'meal'
  | 'mealCustom'
  | 'food'
  | 'foodCustom'
  | 'nutrientTypes'
  | 'portionSizes';

export type ExportFieldTransform<T = SurveySubmissionFood> = (food: T) => string | number;

export type ExportFieldInfo = json2csv.FieldInfo<SurveySubmissionFood>;

export type ExportSectionFields = Record<
  ExportSection,
  (...arg: any[]) => Promise<ExportFieldInfo[]>
>;

export type ExportField = {
  id: string;
  label: string;
  value?: string | ExportFieldTransform;
};

export type ExportFieldTransformCallback<T = SurveySubmissionFood> = (
  field: ExportField
) => ExportFieldTransform<T>;

export const EMPTY = 'N/A';

/*
 * Survey submission fields definition / transformation
 */
export const surveyFields: ExportField[] = [
  {
    id: 'id',
    label: 'Submission ID',
    value: (food) => food.meal?.submission?.id ?? EMPTY,
  },
  {
    id: 'surveyId',
    label: 'Survey ID',
    value: (food) => food.meal?.submission?.surveyId ?? EMPTY,
  },
  {
    id: 'userId',
    label: 'User ID',
    value: (food) => food.meal?.submission?.userId ?? EMPTY,
  },
  {
    id: 'user.name',
    label: 'Username',
    value: (food) => {
      const aliases = food.meal?.submission?.user?.aliases;
      return aliases && aliases.length ? aliases[0].userName : EMPTY;
    },
  },
  {
    id: 'startTime',
    label: 'Start DateTime',
    value: (food) => food.meal?.submission?.startTime?.toString() ?? EMPTY,
  },
  {
    id: 'endTime',
    label: 'End DateTime',
    value: (food) => food.meal?.submission?.endTime?.toString() ?? EMPTY,
  },
  {
    id: 'submissionTime',
    label: 'Submission DateTime',
    value: (food) => food.meal?.submission?.submissionTime?.toString() ?? EMPTY,
  },
];

/*
 * Survey submission custom fields definition / transformation
 * - this should defined at scheme
 */
export const surveyCustomFields: ExportField[] = [
  { id: 'cookingOil', label: 'Cooking oil used' },
  { id: 'diet', label: 'Diet' },
  { id: 'foodAmount', label: 'Food amount' },
  { id: 'foodAmountReason', label: 'Reason for unusual food amount' },
  { id: 'proxy', label: 'Proxy' },
  { id: 'proxyIssues', label: 'Proxy Issues' },
];

export const surveyCustomFieldValue: ExportFieldTransformCallback = (
  field: ExportField
): ExportFieldTransform => (food) => {
  const match = food.meal?.submission?.customFields?.find((item) => field.id === item.name);
  return match?.value ?? EMPTY;
};

/*
 * Meal fields definition / transformation
 */
export const mealFields: ExportField[] = [
  { id: 'name', label: 'Meal name', value: (food) => food.meal?.name ?? EMPTY },
  {
    id: 'time',
    label: 'Meal time',
    value: (food) => (food.meal ? `${food.meal.hours}:${food.meal.minutes}` : EMPTY),
  },
];

/*
 * Survey submission meal custom fields definition / transformation
 * - this should defined at scheme
 */
export const mealCustomFields: ExportField[] = [{ id: 'foodSource', label: 'Food source' }];

export const mealCustomFieldValue: ExportFieldTransformCallback = (
  field: ExportField
): ExportFieldTransform => (food) => {
  const match = food.meal?.customFields?.find((item) => field.id === item.name);
  return match?.value ?? EMPTY;
};

/*
 * Food fields definition / transformation
 */
export const foodFields: ExportField[] = [
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
];

/*
 * Survey submission food custom fields definition / transformation
 * - this should defined at scheme
 */
export const foodCustomFields: ExportField[] = [
  { id: 'servingWeightFactor', label: 'As served weight factor' },
];

export const foodCustomFieldValue: ExportFieldTransformCallback = (
  field: ExportField
): ExportFieldTransform => (food) => {
  const match = food.customFields?.find((item) => field.id === item.name);
  return match?.value ?? EMPTY;
};

export const portionSizeValue = (field: ExportField): ExportFieldTransform => (food) => {
  const match = food.portionSizes?.find((item) => field.id === item.name);
  return match?.value ?? EMPTY;
};

export const portionSizeFields: ExportField[] = [
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

export const nutrientTypeValue = (field: ExportField): ExportFieldTransform => (
  food: SurveySubmissionFood
) => {
  const match = food.nutrients?.find((item) => field.id === item.nutrientTypeId.toString());
  return match?.amount ?? EMPTY;
};

export default (): ExportSectionFields => {
  /**
   * Map record based fields (Survey submission / meal / food)
   *
   * @param {ExportField[]} fields
   * @returns
   */
  const getRecordFields = async (fields: ExportField[]) => {
    return fields.map((field) => {
      const { id, label, value } = field;
      return { label, value: value ?? id };
    });
  };

  /**
   * Map custom field based fields
   *
   * @param {ExportField[]} fields
   * @param {ExportFieldTransformCallback} value
   * @returns
   */
  const getCustomRecordFields = async (
    fields: ExportField[],
    value: ExportFieldTransformCallback
  ) => {
    return fields.map((field) => ({ label: field.label, value: value(field) }));
  };

  /**
   * Survey fields
   *
   */
  const getSurveyFields = () => getRecordFields(surveyFields);

  /**
   * Meal fields
   *
   */
  const getMealFields = () => getRecordFields(mealFields);

  /**
   * Food fields
   *
   */
  const getFoodFields = () => getRecordFields(foodFields);

  /**
   * Survey custom fields
   *
   */
  const getSurveyCustomFields = async () =>
    getCustomRecordFields(surveyCustomFields, surveyCustomFieldValue);

  /**
   * Meal custom fields
   *
   */
  const getMealCustomFields = () => getCustomRecordFields(mealCustomFields, mealCustomFieldValue);

  /**
   * Food custom fields
   *
   */
  const getFoodCustomFields = () => getCustomRecordFields(foodCustomFields, foodCustomFieldValue);

  /**
   * Portion size fields
   *
   */
  const getPortionSizeFields = () => getCustomRecordFields(portionSizeFields, portionSizeValue);

  /**
   * Nutrient type fields
   *
   * @returns
   */
  const getNutrientTypeFields = async () => {
    // TODO: Configurable scheme-based look-up instead locale-based
    const nutrientTypes = await NutrientType.findAll({
      include: [{ model: LocalNutrientType, where: { localeId: 'NDNSv1' } }],
    });

    const nutrientTypeFields: ExportField[] = nutrientTypes.map((type) => ({
      id: type.id.toString(),
      label: type.description,
    }));

    return getCustomRecordFields(nutrientTypeFields, nutrientTypeValue);
  };

  return {
    survey: getSurveyFields,
    surveyCustom: getSurveyCustomFields,
    meal: getMealFields,
    mealCustom: getMealCustomFields,
    food: getFoodFields,
    foodCustom: getFoodCustomFields,
    nutrientTypes: getNutrientTypeFields,
    portionSizes: getPortionSizeFields,
  };
};
