import json2csv from 'json2csv';
import { SurveySubmissionFood } from '@/db/models/system';
import { ExportSection } from '@common/types/models';
import type { IoC } from '@/ioc';
import { ExportField, ExportFieldTransform } from './data-export-fields';

export type ExportFieldInfo = json2csv.FieldInfo<SurveySubmissionFood>;

export type DataExportMapper = Record<
  ExportSection,
  (fields: ExportField[], ...arg: any[]) => Promise<ExportFieldInfo[]>
>;

export type ExportFieldTransformCallback<T = SurveySubmissionFood> = (
  field: ExportField
) => ExportFieldTransform<T>;

export const surveyCustomFieldValue: ExportFieldTransformCallback = (
  field: ExportField
): ExportFieldTransform => (food) => {
  const match = food.meal?.submission?.customFields?.find((item) => field.id === item.name);
  return match?.value;
};

export const mealCustomFieldValue: ExportFieldTransformCallback = (
  field: ExportField
): ExportFieldTransform => (food) => {
  const match = food.meal?.customFields?.find((item) => field.id === item.name);
  return match?.value;
};

export const foodCustomFieldValue: ExportFieldTransformCallback = (
  field: ExportField
): ExportFieldTransform => (food) => {
  const match = food.customFields?.find((item) => field.id === item.name);
  return match?.value;
};

export const portionSizeValue = (field: ExportField): ExportFieldTransform => (food) => {
  const match = food.portionSizes?.find((item) => field.id === item.name);
  return match?.value;
};

export const nutrientTypeValue = (field: ExportField): ExportFieldTransform => (
  food: SurveySubmissionFood
) => {
  const match = food.nutrients?.find((item) => field.id === item.nutrientTypeId.toString());
  return match?.amount;
};

export default ({ dataExportFields }: IoC): DataExportMapper => {
  /**
   * Map record based fields (Survey submission / meal / food)
   *
   * @param {ExportField[]} fields
   * @param {ExportField[]} referenceFields
   * @returns {Promise<ExportFieldInfo[]>}
   */
  const getRecordFields = async (
    fields: ExportField[],
    referenceFields: ExportField[]
  ): Promise<ExportFieldInfo[]> => {
    return fields.map((field) => {
      const match = referenceFields.find((refField) => refField.id === field.id);

      const { id, label } = field;

      return { label, value: match?.value ?? id };
    });
  };

  /**
   * Map custom field based fields
   *
   * @param {ExportField[]} fields
   * @param {ExportFieldTransformCallback} value
   * @returns {Promise<ExportFieldInfo[]>}
   */
  const getCustomRecordFields = async (
    fields: ExportField[],
    value: ExportFieldTransformCallback
  ): Promise<ExportFieldInfo[]> => {
    return fields.map((field) => ({ label: field.label, value: value(field) }));
  };

  /**
   * Survey fields
   *
   * @param {ExportField[]} fields
   * @returns {Promise<ExportFieldInfo[]>}
   */
  const survey = async (fields: ExportField[]): Promise<ExportFieldInfo[]> =>
    getRecordFields(fields, await dataExportFields.survey());

  /**
   * Meal fields
   *
   * @param {ExportField[]} fields
   * @returns {Promise<ExportFieldInfo[]>}
   */
  const meal = async (fields: ExportField[]): Promise<ExportFieldInfo[]> =>
    getRecordFields(fields, await dataExportFields.meal());

  /**
   * Food fields
   *
   * @param {ExportField[]} fields
   * @returns {Promise<ExportFieldInfo[]>}
   */
  const food = async (fields: ExportField[]): Promise<ExportFieldInfo[]> =>
    getRecordFields(fields, await dataExportFields.food());

  /**
   * Survey custom fields
   *
   * @param {ExportField[]} fields
   * @returns {Promise<ExportFieldInfo[]>}
   */
  const surveyCustom = async (fields: ExportField[]): Promise<ExportFieldInfo[]> =>
    getCustomRecordFields(fields, surveyCustomFieldValue);

  /**
   * Meal custom fields
   *
   * @param {ExportField[]} fields
   * @returns {Promise<ExportFieldInfo[]>}
   */
  const mealCustom = (fields: ExportField[]): Promise<ExportFieldInfo[]> =>
    getCustomRecordFields(fields, mealCustomFieldValue);

  /**
   * Food custom fields
   *
   * @param {ExportField[]} fields
   * @returns {Promise<ExportFieldInfo[]>}
   */
  const foodCustom = (fields: ExportField[]): Promise<ExportFieldInfo[]> =>
    getCustomRecordFields(fields, foodCustomFieldValue);

  /**
   * Nutrient type fields
   *
   * @param {ExportField[]} fields
   * @returns {Promise<ExportFieldInfo[]>}
   */
  const nutrientTypes = (fields: ExportField[]): Promise<ExportFieldInfo[]> =>
    getCustomRecordFields(fields, nutrientTypeValue);

  /**
   * Portion sizes fields
   *
   * @param {ExportField[]} fields
   * @returns {Promise<ExportFieldInfo[]>}
   */
  const portionSizes = async (fields: ExportField[]): Promise<ExportFieldInfo[]> =>
    getCustomRecordFields(fields, portionSizeValue);

  return {
    survey,
    surveyCustom,
    meal,
    mealCustom,
    food,
    foodCustom,
    nutrientTypes,
    portionSizes,
  };
};
