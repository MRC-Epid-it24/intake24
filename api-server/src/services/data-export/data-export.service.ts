import fecha from 'fecha';
import { Transform } from 'json2csv';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import {
  Job,
  NutrientType,
  Scheme,
  Survey,
  SurveySubmission,
  SurveySubmissionCustomField,
  SurveySubmissionFood,
  SurveySubmissionFoodCustomField,
  SurveySubmissionMeal,
  SurveySubmissionMealCustomField,
  SurveySubmissionNutrient,
  SurveySubmissionPortionSizeField,
  User,
  UserSurveyAlias,
} from '@/db/models/system';
import type { IoC } from '@/ioc';
import { NotFoundError } from '@/http/errors';
import exportSectionFields, { ExportFieldInfo, ExportSection } from './data-export-fields';

export type DataExportInput = {
  surveyId: string;
  startDate?: Date;
  endDate?: Date;
  userId?: number;
};

export type DataExportOptions = {
  scope: FindOptions;
  fields: ExportFieldInfo[];
  filename: string;
};

export type SyncStreamOutput = {
  filename: string;
  stream: Transform<SurveySubmissionFood>;
};

export type DataExportService = {
  getSubmissionScope: (input: DataExportInput) => FindOptions;
  getExportFields: (survey: Survey) => Promise<ExportFieldInfo[]>;
  prepareExportInfo: (input: DataExportInput) => Promise<DataExportOptions>;
  queueExportJob: (input: DataExportInput) => Promise<Job>;
  syncStream: (input: DataExportInput) => Promise<SyncStreamOutput>;
};

export default ({ scheduler }: IoC): DataExportService => {
  /**
   * Scope to query full survey submission
   *
   * @param {DataExportInput} options
   * @returns {FindOptions}
   */
  const getSubmissionScope = ({ surveyId, startDate, endDate }: DataExportInput): FindOptions => {
    const surveySubmissionConditions: WhereOptions = { surveyId };
    if (startDate) surveySubmissionConditions.startTime = { [Op.gte]: startDate };
    if (endDate) surveySubmissionConditions.endTime = { [Op.lte]: endDate };

    return {
      include: [
        {
          model: SurveySubmissionMeal,
          required: true,
          include: [
            {
              model: SurveySubmission,
              required: true,
              where: surveySubmissionConditions,
              include: [
                { model: Survey, required: true },
                { model: SurveySubmissionCustomField, separate: true },
                {
                  model: User,
                  required: true,
                  include: [{ model: UserSurveyAlias, where: { surveyId }, separate: true }],
                },
              ],
            },
            { model: SurveySubmissionMealCustomField, separate: true },
          ],
        },
        { model: SurveySubmissionFoodCustomField, separate: true },
        {
          model: SurveySubmissionNutrient,
          separate: true,
          include: [{ model: NutrientType, required: true }],
        },
        { model: SurveySubmissionPortionSizeField, separate: true },
      ],
    };
  };

  /**
   * Sort and prepare export fields
   *
   * @param {Survey} survey
   * @returns {Promise<ExportFieldInfo[]>}
   */
  const getExportFields = async (survey: Survey): Promise<ExportFieldInfo[]> => {
    const { scheme } = survey;

    if (!scheme)
      throw new NotFoundError(
        `Survey scheme not found for surveyId: ${survey.id}, schemeId: ${survey.schemeId}`
      );

    // Get this from scheme
    const sections: ExportSection[] = [
      'survey',
      'surveyCustom',
      'meal',
      'mealCustom',
      'food',
      'foodCustom',
      'portionSizes',
      'nutrientTypes',
    ];

    let fields: ExportFieldInfo[] = [];

    const fieldMapper = exportSectionFields();

    for (const section of sections) {
      fields = fields.concat(await fieldMapper[section]());
    }

    return fields;
  };

  /**
   * Prepare export output info
   *
   * @param {DataExportInput} input
   * @returns {Promise<DataExportOptions>}
   */
  const prepareExportInfo = async (input: DataExportInput): Promise<DataExportOptions> => {
    const survey = await Survey.findByPk(input.surveyId, {
      include: [{ model: Scheme, required: true }],
    });
    if (!survey) throw new NotFoundError();

    const { surveyId } = input;

    const scope = getSubmissionScope(input);

    const fields = await getExportFields(survey);
    const timestamp = fecha.format(new Date(), 'YYYY-MM-DD-HH-mm-ss');
    const filename = `intake24-data-export-${surveyId}-${timestamp}.csv`;

    return { scope, fields, filename };
  };

  const queueExportJob = async (input: DataExportInput): Promise<Job> => {
    const { userId, ...rest } = input;

    return scheduler.jobs.addJob({ type: 'SurveyDataExport', userId }, rest);
  };

  const syncStream = async (input: DataExportInput): Promise<SyncStreamOutput> => {
    const { scope, fields, filename } = await prepareExportInfo(input);

    const foods = SurveySubmissionFood.findAllWithStream(scope);
    const transform = new Transform({ fields, withBOM: true });

    foods.on('error', (err) => {
      throw err;
    });

    transform.on('error', (err) => {
      throw err;
    });

    const stream = foods.pipe(transform);

    return { filename, stream };
  };

  return { getSubmissionScope, getExportFields, prepareExportInfo, queueExportJob, syncStream };
};
