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
import type { PaginateQuery } from '@intake24/db';
import { ConflictError, NotFoundError } from '@intake24/api/http/errors';
import { DrinkwareSet, ImageMap } from '@intake24/db';
import { executeWithPagination } from '@intake24/db/kysely/utils';

const drinkwareSetService = ({
  portionSizeService,
  kyselyDb,
  imagesBaseUrl,
  logger,
  sourceImageService,
  processedImageService,
}: Pick<
  IoC,
  | 'kyselyDb'
  | 'imagesBaseUrl'
  | 'logger'
  | 'portionSizeService'
  | 'sourceImageService'
  | 'processedImageService'
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

  const create = async (input: CreateDrinkwareSetInput): Promise<DrinkwareSet> => {
    const { id, description, imageMapId } = input;

    const imageMap = await ImageMap.findByPk(imageMapId, { include: ['baseImage'] });
    if (!imageMap || !imageMap.baseImage) throw new NotFoundError();

    const drinkwareSet = await DrinkwareSet.create({ id, description, imageMapId });

    /* const imageMapObjects = await ImageMapObject.findAll({
      where: { imageMapId },
      order: [['id', 'ASC']],
    });

    const drinkwareScales = imageMapObjects.map((object) => ({
      drinkwareSetId: drinkwareSet.id,
      choiceId: object.id,
      label: object.label,
      height: 0,
      width: 0,
      emptyLevel: 0,
      fullLevel: 0,
    }));

    await DrinkwareScale.bulkCreate(drinkwareScales); */

    return drinkwareSet;
  };

  const update = async (
    drinkwareSetId: string,
    input: UpdateDrinkwareSetInput
  ): Promise<DrinkwareSet> => {
    const { description, scales } = input;

    const drinkwareSet = await portionSizeService.getDrinkwareSet(drinkwareSetId);
    if (!drinkwareSet.scales) throw new NotFoundError();

    await drinkwareSet.update({ description });

    for (const scale of scales) {
      const { id, label } = scale;
      const match = drinkwareSet.scales.find((scale) => scale.drinkwareSetId === id);

      if (!match) {
        // TODO
        // await DrinkwareScale.create({ drinkwareSetId, label });
        continue;
      }

      await match.update({ label });
    }

    return portionSizeService.getDrinkwareSet(drinkwareSetId);
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

  const createDrinkScale = async (
    drinkwareSetId: string,
    choiceId: string,
    uploaderId: string,
    baseImageFile: Express.Multer.File,
    labelJson: string,
    outlineCoordinatesJson: string,
    volumeSamplesJson: string,
    update: boolean
  ) => {
    const sourceImage = await sourceImageService.uploadSourceImage(
      {
        id: drinkwareSetId,
        file: baseImageFile,
        uploader: uploaderId,
      },
      'drink_scale'
    );

    const processedImage = await processedImageService.createDrinkScaleBaseImage(
      drinkwareSetId,
      sourceImage
    );

    await kyselyDb.foods.transaction().execute(async (tx) => {
      if (update) {
        await kyselyDb.foods
          .deleteFrom('drinkwareScalesV2')
          .where('drinkwareSetId', '=', drinkwareSetId)
          .where('choiceId', '=', choiceId)
          .execute();
      }

      try {
        await kyselyDb.foods
          .insertInto('drinkwareScalesV2')
          .values({
            label: labelJson,
            choiceId,
            drinkwareSetId,
            baseImageId: processedImage.id,
            outlineCoordinates: outlineCoordinatesJson,
            volumeSamples: volumeSamplesJson,
          })
          .execute();
      } catch (e: any) {
        if (e.code === '23505')
          throw new ConflictError(
            `Drink scale for set "${drinkwareSetId}", object ${choiceId} already exists`
          );
        else throw e;
      }
    });
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
    getDrinkwareSets,
    createDrinkScale,
    destroyDrinkScale,
    destroyAllDrinkScales,
    create,
    update,
    destroy,
  };
};

export default drinkwareSetService;

export type DrinkwareSetService = ReturnType<typeof drinkwareSetService>;
