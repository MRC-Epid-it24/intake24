import { format as formatDate } from 'date-fns';
import { Transform } from 'json2csv';
import { groupBy } from 'lodash';
import { Readable } from 'stream';

import type { IoC } from '@intake24/api/ioc';
import type { ExportSection } from '@intake24/common/schemes';
import type { JobParams } from '@intake24/common/types';
import type { IncludeOptions, Job, Order, StreamFindOptions, WhereOptions } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { Op, Survey, SurveySubmissionFood, SurveySubmissionMissingFood } from '@intake24/db';

import type { ExportFieldInfo } from './data-export-mapper';
import { EMPTY } from './data-export-fields';

export type DataExportInput = JobParams['SurveyDataExport'];

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

const dataExportService = ({
  dataExportMapper,
  scheduler,
}: Pick<IoC, 'dataExportMapper' | 'scheduler'>) => {
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

    const include: IncludeOptions[] = [
      {
        association: 'meal',
        required: true,
        include: [
          {
            association: 'submission',
            required: true,
            where: surveySubmissionConditions,
            include: [
              { association: 'survey', required: true },
              { association: 'customFields', separate: true },
              {
                association: 'user',
                required: true,
                include: [
                  { association: 'aliases', where: { surveyId }, separate: true },
                  { association: 'customFields', separate: true },
                ],
              },
            ],
          },
          { association: 'customFields', separate: true },
        ],
      },
    ];
    const order: Order = [['id', 'ASC']];

    const foods = {
      include: [
        ...include,
        { association: 'customFields', separate: true },
        { association: 'fields', separate: true },
        {
          association: 'nutrients',
          separate: true,
          include: [{ association: 'nutrientType', required: true }],
        },
        { association: 'portionSizes', separate: true },
      ],
      order,
    };

    const missingFoods = { include, order };

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
    } catch (err) {
      inputStream.destroy(err instanceof Error ? err : undefined);
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
      include: [{ association: 'surveyScheme', required: true }],
    });
    if (!survey || !survey.surveyScheme) throw new NotFoundError();

    const options = getSubmissionOptions(input);

    const fields = await getExportFields(survey.surveyScheme.dataExport);
    const timestamp = formatDate(new Date(), 'yyyyMMdd-HHmmss');
    const filename = `intake24-data-export-${surveyId}-${timestamp}.csv`;

    const [totalFoods, totalMissingFoods] = await Promise.all([
      SurveySubmissionFood.count(options.foods),
      SurveySubmissionMissingFood.count(options.missingFoods),
    ]);

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

export default dataExportService;

export type DataExportService = ReturnType<typeof dataExportService>;
