import type { Expression, SqlBool } from 'kysely';
import { groupBy, mapValues } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { LocaleTranslation } from '@intake24/common/types';
import type {
  CreateDrinkwareSetInput,
  DrinkwareScaleEntry,
  DrinkwareScaleV2Entry,
  DrinkwareSetEntry,
  DrinkwareSetsResponse,
  UpdateDrinkwareSetInput,
} from '@intake24/common/types/http/admin';
import type { PaginateQuery, ProcessedImage } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { translateSqlErrors } from '@intake24/api/util/sequelize-errors';
import { DrinkwareSet, executeWithPagination } from '@intake24/db';

import ApplicationError from '../../../http/errors/application.error';

const drinkwareSetService = ({
  kyselyDb,
  imagesBaseUrl,
  logger,
  sourceImageService,
  processedImageService,
}: Pick<
  IoC,
  'kyselyDb' | 'imagesBaseUrl' | 'logger' | 'sourceImageService' | 'processedImageService'
>) => {
  function getImageUrl(relativeUrl: string): string {
    return `${imagesBaseUrl}/${relativeUrl}`;
  }

  function parseLocaleTranslation(text: string | null): LocaleTranslation {
    if (text == null) return {};

    try {
      return JSON.parse(text); // should validate the result
    } catch (e) {
      logger.warn(`Failed to parse "${text}" as JSON string (expected LocaleTranslation)`);
      return {};
    }
  }

  function parseFloatArray(text: string, sourceFieldName: string): number[] {
    const jsonObject = JSON.parse(text);

    if (!Array.isArray(jsonObject))
      throw new Error(
        `Expected a JSON array in field ${sourceFieldName}, but received ${typeof jsonObject}`
      );

    for (const v of jsonObject) {
      if (typeof v !== 'number') {
        throw new Error(
          `Expected an array of numbers in field ${sourceFieldName}, but encountered element of type ${typeof v}`
        );
      }
    }

    return jsonObject as number[];
  }

  async function checkSetId(setId: string): Promise<void> {
    const records = await kyselyDb.foods
      .selectFrom('drinkwareSets')
      .select('drinkwareSets.id')
      .where('drinkwareSets.id', '=', setId)
      .execute();

    if (records.length === 0) throw new NotFoundError(`Drinkware set "${setId}" not found`);
  }

  const create = async (input: CreateDrinkwareSetInput): Promise<void> => {
    // This is wasteful and incorrect (race condition)
    // Should handle the SQL foreign key error code instead
    await kyselyDb.foods
      .selectFrom('imageMaps')
      .where('id', '=', input.imageMapId)
      .executeTakeFirstOrThrow(
        (_) => new ApplicationError(`Image map ${input.imageMapId} does not exist.`)
      );

    await translateSqlErrors(() =>
      kyselyDb.foods.insertInto('drinkwareSets').values(input).execute()
    );
  };

  const update = async (drinkwareSetId: string, input: UpdateDrinkwareSetInput): Promise<void> => {
    await kyselyDb.foods
      .selectFrom('imageMaps')
      .where('id', '=', input.imageMapId)
      .executeTakeFirstOrThrow(
        (_) => new ApplicationError(`Image map ${input.imageMapId} does not exist.`)
      );

    const { numUpdatedRows } = await kyselyDb.foods
      .updateTable('drinkwareSets')
      .set(input)
      .where('drinkwareSets.id', '=', drinkwareSetId)
      .executeTakeFirst();

    if (numUpdatedRows !== 1n) throw new NotFoundError();
  };

  const destroy = async (drinkwareSetId: string): Promise<void> => {
    const drinkwareSet = await DrinkwareSet.findByPk(drinkwareSetId, { attributes: ['id'] });
    if (!drinkwareSet) throw new NotFoundError();

    await drinkwareSet.destroy();
  };

  //#region Legacy drink scale format with pre-rendered overlays

  const fetchDrinkScaleRecords = async (drinkwareSetId: string, choiceId?: string) => {
    const scaleRecords = await kyselyDb.foods
      .selectFrom('drinkwareScales')
      .select([
        'id',
        'width',
        'height',
        'emptyLevel',
        'fullLevel',
        'choiceId',
        'baseImageUrl',
        'overlayImageUrl',
        'label',
      ])
      .where((eb) => {
        const terms: Expression<SqlBool>[] = [];

        terms.push(eb('drinkwareSetId', '=', drinkwareSetId));

        if (choiceId !== undefined) {
          terms.push(eb('choiceId', '=', choiceId));
        }

        return eb.and(terms);
      })
      .orderBy('choiceId')
      .execute();

    return scaleRecords;
  };

  const fetchVolumeSampleRecords = async (scaleId: string[]) => {
    if (scaleId.length === 0) return [];

    return await kyselyDb.foods
      .selectFrom('drinkwareVolumeSamples')
      .select(['drinkwareScaleId', 'fill', 'volume'])
      .where('drinkwareScaleId', 'in', scaleId)
      .execute();
  };

  const getDrinkScaleV1 = async (
    drinkwareSetId: string,
    choiceId: string
  ): Promise<DrinkwareScaleEntry | undefined> => {
    await checkSetId(drinkwareSetId);

    const records = await fetchDrinkScaleRecords(drinkwareSetId, choiceId);

    if (records.length === 0) return undefined;

    const record = records[0];

    const volumeSampleRecords = await fetchVolumeSampleRecords([record.id]);
    const volumeSamples = volumeSampleRecords.flatMap((r) => [r.fill, r.volume]);

    return {
      version: 1,
      label: parseLocaleTranslation(record.label),
      choiceId: parseInt(record.choiceId),
      width: record.width,
      height: record.height,
      fullLevel: record.fullLevel,
      emptyLevel: record.emptyLevel,
      volumeSamples,
      baseImageUrl: getImageUrl(record.baseImageUrl),
      overlayImageUrl: getImageUrl(record.overlayImageUrl),
    };
  };

  const getDrinkScalesV1 = async (drinkwareSetId: string): Promise<DrinkwareScaleEntry[]> => {
    await checkSetId(drinkwareSetId);

    const records = await fetchDrinkScaleRecords(drinkwareSetId);
    const volumeSampleRecords = await fetchVolumeSampleRecords(records.map((r) => r.id));

    // Convert from a list of records (scale_id, fill, volume) to a map scale_id -> number[],
    // where the numbers are a flattened list of (fill, volume) pairs

    const volumeSamples = mapValues(
      groupBy(volumeSampleRecords, (r) => r.drinkwareScaleId),
      (grouped) => grouped.flatMap((r) => [r.fill, r.volume])
    );

    return records.map((record) => ({
      version: 1,
      label: parseLocaleTranslation(record.label),
      choiceId: parseInt(record.choiceId),
      width: record.width,
      height: record.height,
      fullLevel: record.fullLevel,
      emptyLevel: record.emptyLevel,
      volumeSamples: volumeSamples[record.id],
      baseImageUrl: getImageUrl(record.baseImageUrl),
      overlayImageUrl: getImageUrl(record.overlayImageUrl),
    }));
  };

  //#endregion

  //#region V2 drink scale format with client-rendered overlays

  const fetchDrinkScaleV2Records = async (drinkwareSetId: string, choiceId?: string) => {
    const scaleRecords = await kyselyDb.foods
      .selectFrom('drinkwareScalesV2')
      .leftJoin('processedImages', 'processedImages.id', 'drinkwareScalesV2.baseImageId')
      .select([
        'drinkwareScalesV2.id as id',
        'choiceId',
        'outlineCoordinates',
        'volumeSamples',
        'volumeSamplesNormalised',
        'baseImageId',
        'processedImages.path as baseImagePath',
        'drinkwareScalesV2.label',
      ])
      .where((eb) => {
        const terms: Expression<SqlBool>[] = [];

        terms.push(eb('drinkwareSetId', '=', drinkwareSetId));

        if (choiceId !== undefined) {
          terms.push(eb('choiceId', '=', choiceId));
        }

        return eb.and(terms);
      })
      .orderBy('choiceId')
      .execute();

    return scaleRecords;
  };

  type DrinkScaleV2Record = {
    choiceId: string;
    baseImageId: string;
    outlineCoordinates: string;
    volumeSamples: string;
    volumeSamplesNormalised: string;
    label: string | null;
    id: string;
    baseImagePath: string | null;
  };

  function formatDrinkScaleV2(
    drinkwareSetId: string,
    record: DrinkScaleV2Record
  ): DrinkwareScaleV2Entry {
    if (record.baseImagePath === null)
      throw new Error(
        `Drink scale image missing for drinkware set ${drinkwareSetId}, object id ${record.choiceId}, image id ${record.baseImageId}`
      );

    return {
      version: 2,
      choiceId: parseInt(record.choiceId),
      label: parseLocaleTranslation(record.label),
      outlineCoordinates: parseFloatArray(record.outlineCoordinates, 'outline_coordinates'),
      volumeSamples: parseFloatArray(record.volumeSamples, 'volume_samples'),
      volumeSamplesNormalised: parseFloatArray(
        record.volumeSamplesNormalised,
        'volume_samples_normalised'
      ),
      baseImageUrl: getImageUrl(record.baseImagePath),
    };
  }

  const getDrinkScalesV2 = async (drinkwareSetId: string): Promise<DrinkwareScaleV2Entry[]> => {
    await checkSetId(drinkwareSetId);

    const records = await fetchDrinkScaleV2Records(drinkwareSetId);

    return records.map((record) => formatDrinkScaleV2(drinkwareSetId, record));
  };

  const getDrinkScaleV2 = async (
    drinkwareSetId: string,
    choiceId: string
  ): Promise<DrinkwareScaleV2Entry | undefined> => {
    await checkSetId(drinkwareSetId);

    const records = await fetchDrinkScaleV2Records(drinkwareSetId, choiceId);

    if (records.length === 0) return undefined;

    return formatDrinkScaleV2(drinkwareSetId, records[0]);
  };

  //#endregion

  const getDrinkScale = async (
    drinkwareSetId: string,
    choiceId: string
  ): Promise<DrinkwareScaleEntry | DrinkwareScaleV2Entry> => {
    await checkSetId(drinkwareSetId);

    const recordV2 = await getDrinkScaleV2(drinkwareSetId, choiceId);

    if (recordV2 !== undefined) return recordV2;

    const recordV1 = await getDrinkScaleV1(drinkwareSetId, choiceId);

    if (recordV1 !== undefined) return recordV1;

    throw new NotFoundError(
      `Drinkware set ${drinkwareSetId} has no drink scale for object ${choiceId}`
    );
  };

  const getDrinkScales = async (
    drinkwareSetId: string
  ): Promise<(DrinkwareScaleEntry | DrinkwareScaleV2Entry)[]> => {
    await checkSetId(drinkwareSetId);

    const recordsV2 = await getDrinkScalesV2(drinkwareSetId);
    const recordsV1 = await getDrinkScalesV1(drinkwareSetId);

    return [...recordsV2, ...recordsV1];
  };

  const processDrinkScaleImage = async (
    id: string,
    uploader: string,
    file: Express.Multer.File
  ): Promise<ProcessedImage> => {
    const sourceImage = await sourceImageService.uploadSourceImage(
      {
        id,
        file,
        uploader,
      },
      'drink_scale'
    );

    const processedImage = await processedImageService.createDrinkScaleBaseImage(id, sourceImage);

    return processedImage;
  };

  const normaliseVolumeSamples = (volumeSamples: number[]): number[] => {
    const sampleCount = Math.floor(volumeSamples.length / 2);

    let maxFillLevel = 0;

    for (let i = 0; i < sampleCount; i++) {
      if (volumeSamples[i * 2] > maxFillLevel) maxFillLevel = volumeSamples[i * 2];
    }

    if (maxFillLevel === 0) {
      console.warn(`Volume samples max fill level is 0. Check the drink scale data. `);
      return volumeSamples;
    }

    const normalised: number[] = [];

    for (let i = 0; i < sampleCount; i++) {
      normalised[i * 2] = volumeSamples[i * 2] / maxFillLevel;
      normalised[i * 2 + 1] = volumeSamples[i * 2 + 1];
    }

    return normalised;
  };

  const createDrinkScaleV2 = async (
    drinkwareSetId: string,
    choiceId: string,
    uploaderId: string,
    baseImageFile: Express.Multer.File,
    labelJson: string,
    outlineCoordinatesJson: string,
    volumeSamplesJson: string,
    updateOnConflict: boolean
  ) => {
    const processedImage = await processDrinkScaleImage(drinkwareSetId, uploaderId, baseImageFile);
    const normalisedVolumeSamplesJson = JSON.stringify(
      normaliseVolumeSamples(JSON.parse(volumeSamplesJson))
    );

    await translateSqlErrors(() =>
      kyselyDb.foods.transaction().execute(async (tx) => {
        if (updateOnConflict) {
          await tx
            .deleteFrom('drinkwareScalesV2')
            .where('drinkwareSetId', '=', drinkwareSetId)
            .where('choiceId', '=', choiceId)
            .execute();
        }

        await tx
          .insertInto('drinkwareScalesV2')
          .values({
            label: labelJson,
            choiceId,
            drinkwareSetId,
            baseImageId: processedImage.id,
            outlineCoordinates: outlineCoordinatesJson,
            volumeSamples: volumeSamplesJson,
            volumeSamplesNormalised: normalisedVolumeSamplesJson,
          })
          .execute();
      })
    );
  };

  const createDrinkScaleV1 = async (
    drinkwareSetId: string,
    choiceId: string,
    uploaderId: string,
    baseImageFile: Express.Multer.File,
    overlayImageFile: Express.Multer.File,
    labelJson: string,
    width: string,
    height: string,
    fullLevel: string,
    emptyLevel: string,
    volumeSamplesJson: string,
    update: boolean
  ) => {
    // Hacky but an easy way to handle legacy unprocessed drink scale images

    const baseImage = await sourceImageService.uploadSourceImage(
      {
        id: drinkwareSetId,
        file: baseImageFile,
        uploader: uploaderId,
      },
      'drink_scale'
    );

    const overlayImage = await sourceImageService.uploadSourceImage(
      {
        id: drinkwareSetId,
        file: overlayImageFile,
        uploader: uploaderId,
      },
      'drink_scale'
    );

    const volumeSamples = JSON.parse(volumeSamplesJson) as { fill: number; volume: number }[];

    await translateSqlErrors(() =>
      kyselyDb.foods.transaction().execute(async (tx) => {
        if (update) {
          await tx
            .deleteFrom('drinkwareScales')
            .where('drinkwareSetId', '=', drinkwareSetId)
            .where('choiceId', '=', choiceId)
            .execute();
        }

        const { id } = await tx
          .insertInto('drinkwareScales')
          .values({
            label: labelJson,
            choiceId,
            drinkwareSetId,
            width: parseInt(width),
            height: parseInt(height),
            emptyLevel: parseInt(emptyLevel),
            fullLevel: parseInt(fullLevel),
            baseImageUrl: baseImage.path,
            overlayImageUrl: overlayImage.path,
          })
          .returning('id')
          .executeTakeFirstOrThrow();

        const volumeSamplesRows = volumeSamples.map((sample) => ({
          drinkwareScaleId: id,
          ...sample,
        }));

        await tx.insertInto('drinkwareVolumeSamples').values(volumeSamplesRows).execute();
      })
    );
  };

  const getDrinkwareSet = async (
    drinkwareSetId: string
  ): Promise<DrinkwareSetEntry | undefined> => {
    const sets = await kyselyDb.foods
      .selectFrom('drinkwareSets')
      .select(['id', 'description', 'imageMapId'])
      .where('drinkwareSets.id', '=', drinkwareSetId)
      .execute();

    if (sets.length === 0) return undefined;

    const recordsV2 = await getDrinkScalesV2(drinkwareSetId);
    const recordsV1 = await getDrinkScalesV1(drinkwareSetId);

    return {
      id: sets[0].id,
      description: sets[0].description,
      imageMapId: sets[0].imageMapId,
      scales: [...recordsV2, ...recordsV1],
    };
  };

  const getDrinkwareSetOrThrow = async (drinkwareSetId: string): Promise<DrinkwareSetEntry> => {
    const set = await getDrinkwareSet(drinkwareSetId);

    if (set === undefined)
      throw new Error(
        `Couldn't find drinkware set "${drinkwareSetId}" which was unexpected at this point`
      );

    return set;
  };

  const getDrinkwareSets = async (pagination: PaginateQuery): Promise<DrinkwareSetsResponse> => {
    const query = kyselyDb.foods
      .selectFrom('drinkwareSets')
      .leftJoin('imageMaps', 'imageMaps.id', 'drinkwareSets.imageMapId')
      .leftJoin('processedImages', 'processedImages.id', 'imageMaps.baseImageId')
      .select([
        'drinkwareSets.id',
        'drinkwareSets.description',
        'processedImages.path as imagePath',
      ]);

    const { data, meta } = await executeWithPagination(
      query,
      ['drinkwareSets.description', 'drinkwareSets.id'],
      ['drinkwareSets.description'],
      pagination
    );

    return {
      meta,
      data: data.map((record) => {
        if (record.imagePath === null)
          throw new Error(
            `Drinkware set ${record.id} is broken: either the image map id is invalid, or the base image is missing`
          );
        return {
          id: record.id,
          description: record.description,
          imageUrl: getImageUrl(record.imagePath),
        };
      }),
    };
  };

  const destroyDrinkScale = async (drinkwareSetId: string, choiceId: string) => {
    const deleteResultV1 = await kyselyDb.foods
      .deleteFrom('drinkwareScales')
      .where('drinkwareSetId', '=', drinkwareSetId)
      .where('choiceId', '=', choiceId)
      .executeTakeFirst();

    const deleteResultV2 = await kyselyDb.foods
      .deleteFrom('drinkwareScalesV2')
      .where('drinkwareSetId', '=', drinkwareSetId)
      .where('choiceId', '=', choiceId)
      .executeTakeFirst();

    return deleteResultV1.numDeletedRows + deleteResultV2.numDeletedRows;
  };

  const destroyAllDrinkScales = async (drinkwareSetId: string) => {
    const deleteResultV1 = await kyselyDb.foods
      .deleteFrom('drinkwareScales')
      .where('drinkwareSetId', '=', drinkwareSetId)
      .executeTakeFirst();

    const deleteResultV2 = await kyselyDb.foods
      .deleteFrom('drinkwareScalesV2')
      .where('drinkwareSetId', '=', drinkwareSetId)
      .executeTakeFirst();

    return deleteResultV1.numDeletedRows + deleteResultV2.numDeletedRows;
  };

  return {
    getDrinkScaleV1,
    getDrinkScalesV1,
    getDrinkScaleV2,
    getDrinkScalesV2,
    getDrinkScale,
    getDrinkScales,
    getDrinkwareSet,
    getDrinkwareSetOrThrow,
    getDrinkwareSets,
    createDrinkScaleV1,
    createDrinkScaleV2,
    destroyDrinkScale,
    destroyAllDrinkScales,
    create,
    update,
    destroy,
  };
};

export default drinkwareSetService;

export type DrinkwareSetService = ReturnType<typeof drinkwareSetService>;
