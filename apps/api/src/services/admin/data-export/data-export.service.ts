import { format as formatDate } from 'date-fns';
import { Transform } from 'json2csv';
import { groupBy } from 'lodash';
import {
  Op,
  Order,
  WhereOptions,
  Job,
  SystemNutrientType,
  Scheme,
  Survey,
  SurveySubmission,
  SurveySubmissionCustomField,
  SurveySubmissionFood,
  SurveySubmissionFoodCustomField,
  SurveySubmissionField,
  SurveySubmissionMeal,
  SurveySubmissionMealCustomField,
  SurveySubmissionMissingFood,
  SurveySubmissionNutrient,
  SurveySubmissionPortionSizeField,
  User,
  UserSurveyAlias,
  UserCustomField,
  StreamFindOptions,
} from '@intake24/db';
import { Readable } from 'stream';
import type { ExportSection } from '@intake24/common/types/models';
import type { SurveyDataExportParams } from '@intake24/common/types';
import type { IoC } from '@intake24/api/ioc';
import { NotFoundError } from '@intake24/api/http/errors';
import type { ExportFieldInfo } from './data-export-mapper';
import { EMPTY } from './data-export-fields';

export type DataExportInput = SurveyDataExportParams;

export type SubmissionFindOptions = Record<'foods' | 'missingFoods', StreamFindOptions>;

export type DataExportOptions = {
  options: SubmissionFindOptions;
  fields: ExportFieldInfo[];
  filename: string;
  total: number;
};

export type SyncStreamOutput = {
  filename: string;
  stream: Transform<SurveySubmissionFood>;
};

export type DataExportService = {
  getSubmissionOptions: (input: DataExportInput) => SubmissionFindOptions;
  getSubmissionsWithStream: (options: SubmissionFindOptions) => Readable;
  getExportFields: (sections: ExportSection[]) => Promise<ExportFieldInfo[]>;
  prepareExportInfo: (input: DataExportInput) => Promise<DataExportOptions>;
  queueExportJob: (input: DataExportInput) => Promise<Job>;
  syncStream: (input: DataExportInput) => Promise<SyncStreamOutput>;
};

export default ({
  dataExportMapper,
  scheduler,
}: Pick<IoC, 'dataExportMapper' | 'scheduler'>): DataExportService => {
  /**
   * Scope to query submission foods and missing foods records
   *
   * @param {DataExportInput} options
   * @returns {SubmissionScopes}
   */
  const getSubmissionOptions = ({
    surveyId,
    id,
    startDate,
    endDate,
  }: DataExportInput): SubmissionFindOptions => {
    const surveySubmissionConditions: WhereOptions = { surveyId };
    if (id) surveySubmissionConditions.id = id;
    if (startDate) surveySubmissionConditions.startTime = { [Op.gte]: startDate };
    if (endDate) surveySubmissionConditions.endTime = { [Op.lte]: endDate };

    const include = {
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
              include: [
                { model: UserSurveyAlias, where: { surveyId }, separate: true },
                { model: UserCustomField, separate: true },
              ],
            },
          ],
        },
        { model: SurveySubmissionMealCustomField, separate: true },
      ],
    };
    const order: Order = [['id', 'ASC']];

    const foods = {
      include: [
        include,
        { model: SurveySubmissionFoodCustomField, separate: true },
        { model: SurveySubmissionField, separate: true },
        {
          model: SurveySubmissionNutrient,
          separate: true,
          include: [{ model: SystemNutrientType, required: true }],
        },
        { model: SurveySubmissionPortionSizeField, separate: true },
      ],
      order,
    };

    const missingFoods = { include: [include], order };

    return { foods, missingFoods };
  };

  /**
   * Query the foods | missing foods and push to stream
   *
   * @param {Readable} inputStream
   * @param {SubmissionFindOptions} options
   * @returns {Promise<void>}
   */
  const performSubmissionsSearch = async (
    inputStream: Readable,
    options: SubmissionFindOptions
  ): Promise<void> => {
    const { batchSize = 100, limit, offset: startOffset = 0, ...params } = options.foods;

    try {
      const max = limit ?? (await SurveySubmissionFood.count(params));

      const offsets = [];
      let start = startOffset;

      while (start < max) {
        offsets.push(start);
        start += batchSize;
      }

      for (const offset of offsets) {
        const difference = batchSize + offset - max;
        const foods = await SurveySubmissionFood.findAll({
          ...params,
          offset,
          limit: difference > 0 ? batchSize - difference : batchSize,
        });

        const mealId = foods.map((food) => food.mealId);
        const missingFoods = await SurveySubmissionMissingFood.findAll({
          ...options.missingFoods,
          where: { mealId },
        });

        const groupedFoods = groupBy(foods, 'mealId');
        const groupedMissingFoods = groupBy(missingFoods, 'mealId');

        for (const [id, records] of Object.entries(groupedFoods)) {
          inputStream.push(JSON.stringify([...records, ...(groupedMissingFoods[id] ?? [])]));
        }
      }

      inputStream.push(null);
    } catch (err: any) {
      inputStream.destroy(err);
    }
  };

  /**
   * Get streamed submissions
   *
   * @param {SubmissionFindOptions} options
   * @returns {Readable}
   */
  const getSubmissionsWithStream = (options: SubmissionFindOptions): Readable => {
    const inputStream = new Readable({
      // objectMode: true,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      read() {},
    });
    performSubmissionsSearch(inputStream, options);

    return inputStream;
  };

  /**
   * Sort and prepare export fields
   *
   * @param {ExportSection[]} sections
   * @returns {Promise<ExportFieldInfo[]>}
   */
  const getExportFields = async (sections: ExportSection[]): Promise<ExportFieldInfo[]> => {
    const fields: ExportFieldInfo[] = [];

    for (const section of sections) {
      fields.push(...(await dataExportMapper[section.id](section.fields)));
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
    const { surveyId } = input;

    const survey = await Survey.findByPk(surveyId, {
      include: [{ model: Scheme, required: true }],
    });
    if (!survey || !survey.scheme) throw new NotFoundError();

    const options = getSubmissionOptions(input);

    const fields = await getExportFields(survey.scheme.export);
    const timestamp = formatDate(new Date(), 'yyyyMMdd-HHmmss');
    const filename = `intake24-data-export-${surveyId}-${timestamp}.csv`;

    const totalFoods = await SurveySubmissionFood.count(options.foods);
    const totalMissingFoods = await SurveySubmissionMissingFood.count(options.missingFoods);

    return { options, fields, filename, total: totalFoods + totalMissingFoods };
  };

  /**
   * Push data export job to queue
   *
   * @param {DataExportInput} input
   * @returns {Promise<Job>}
   */
  const queueExportJob = async (input: DataExportInput): Promise<Job> => {
    const { userId, ...rest } = input;

    return scheduler.jobs.addJob({ type: 'SurveyDataExport', userId }, rest);
  };

  /**
   * Generate CSV stream for http response
   *
   * @param {DataExportInput} input
   * @returns {Promise<SyncStreamOutput>}
   */
  const syncStream = async (input: DataExportInput): Promise<SyncStreamOutput> => {
    const { options, fields, filename } = await prepareExportInfo(input);

    const foods = SurveySubmissionFood.findAllWithStream(options.foods);
    const transform = new Transform({ fields, defaultValue: EMPTY, withBOM: true });

    foods.on('error', (err) => {
      throw err;
    });

    transform.on('error', (err) => {
      throw err;
    });

    const stream = foods.pipe(transform);

    return { filename, stream };
  };

  return {
    getSubmissionOptions,
    getSubmissionsWithStream,
    getExportFields,
    prepareExportInfo,
    queueExportJob,
    syncStream,
  };
};
