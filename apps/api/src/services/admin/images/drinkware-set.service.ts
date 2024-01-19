import type { Expression, SqlBool } from 'kysely';
import { groupBy, mapValues } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { LocaleTranslation } from '@intake24/common/types';
import type {
  CreateDrinkwareSetInput,
  DrinkScaleEntry,
  DrinkScaleV2Entry,
  UpdateDrinkwareSetInput,
} from '@intake24/common/types/http/admin';
import { ConflictError, NotFoundError, ValidationError } from '@intake24/api/http/errors';
import { DrinkwareSet, ImageMap, User } from '@intake24/db';

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
      .selectFrom('drinkware_sets')
      .select('drinkware_sets.id')
      .where('drinkware_sets.id', '=', setId)
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
      .selectFrom('drinkware_scales')
      .select([
        'id',
        'width',
        'height',
        'empty_level',
        'full_level',
        'choice_id',
        'base_image_url',
        'overlay_image_url',
        'label',
      ])
      .where((eb) => {
        const terms: Expression<SqlBool>[] = [];

        terms.push(eb('drinkware_set_id', '=', drinkwareSetId));

        if (choiceId !== undefined) {
          terms.push(eb('choice_id', '=', choiceId));
        }

        return eb.and(terms);
      })
      .orderBy('choice_id')
      .execute();

    return scaleRecords;
  };

  const fetchVolumeSampleRecords = async (scaleId: string[]) => {
    return await kyselyDb.foods
      .selectFrom('drinkware_volume_samples')
      .select(['drinkware_scale_id', 'fill', 'volume'])
      .where('drinkware_scale_id', 'in', scaleId)
      .execute();
  };

  const getDrinkScaleV1 = async (
    drinkwareSetId: string,
    choiceId: string
  ): Promise<DrinkScaleEntry | undefined> => {
    await checkSetId(drinkwareSetId);

    const records = await fetchDrinkScaleRecords(drinkwareSetId, choiceId);

    if (records.length === 0) return undefined;

    const record = records[0];

    const volumeSampleRecords = await fetchVolumeSampleRecords([record.id]);
    const volumeSamples = volumeSampleRecords.flatMap((r) => [r.fill, r.volume]);

    return {
      version: 1,
      id: record.id,
      label: parseLocaleTranslation(record.label),
      choiceId: record.choice_id,
      width: record.width,
      height: record.height,
      fullLevel: record.full_level,
      emptyLevel: record.empty_level,
      volumeSamples,
      baseImageUrl: getImageUrl(record.base_image_url),
      overlayImageUrl: getImageUrl(record.overlay_image_url),
    };
  };

  const getDrinkScalesV1 = async (drinkwareSetId: string): Promise<DrinkScaleEntry[]> => {
    await checkSetId(drinkwareSetId);

    const records = await fetchDrinkScaleRecords(drinkwareSetId);
    const volumeSampleRecords = await fetchVolumeSampleRecords(records.map((r) => r.id));

    // Convert from a list of records (scale_id, fill, volume) to a map scale_id -> number[],
    // where the numbers are a flattened list of (fill, volume) pairs

    const volumeSamples = mapValues(
      groupBy(volumeSampleRecords, (r) => r.drinkware_scale_id),
      (grouped) => grouped.flatMap((r) => [r.fill, r.volume])
    );

    return records.map((record) => ({
      version: 1,
      id: record.id,
      label: parseLocaleTranslation(record.label),
      choiceId: record.choice_id,
      width: record.width,
      height: record.height,
      fullLevel: record.full_level,
      emptyLevel: record.empty_level,
      volumeSamples: volumeSamples[record.id],
      baseImageUrl: getImageUrl(record.base_image_url),
      overlayImageUrl: getImageUrl(record.overlay_image_url),
    }));
  };

  //#endregion

  //#region V2 drink scale format with client-rendered overlays

  const fetchDrinkScaleV2Records = async (drinkwareSetId: string, choiceId?: string) => {
    const scaleRecords = await kyselyDb.foods
      .selectFrom('drinkware_scales_v2')
      .leftJoin('processed_images', 'processed_images.id', 'drinkware_scales_v2.base_image_id')
      .select([
        'drinkware_scales_v2.id as id',
        'choice_id',
        'outline_coordinates',
        'volume_samples',
        'base_image_id',
        'processed_images.path as base_image_path',
        'drinkware_scales_v2.label',
      ])
      .where((eb) => {
        const terms: Expression<SqlBool>[] = [];

        terms.push(eb('drinkware_set_id', '=', drinkwareSetId));

        if (choiceId !== undefined) {
          terms.push(eb('choice_id', '=', choiceId));
        }

        return eb.and(terms);
      })
      .orderBy('choice_id')
      .execute();

    return scaleRecords;
  };

  type DrinkScaleV2Record = {
    choice_id: string;
    base_image_id: string;
    outline_coordinates: string;
    volume_samples: string;
    label: string | null;
    id: string;
    base_image_path: string | null;
  };

  function formatDrinkScaleV2(
    drinkwareSetId: string,
    record: DrinkScaleV2Record
  ): DrinkScaleV2Entry {
    if (record.base_image_path === null)
      throw new Error(
        `Drink scale image missing for drinkware set ${drinkwareSetId}, object id ${record.choice_id}, image id ${record.base_image_id}`
      );

    return {
      version: 2,
      id: record.id,
      choiceId: record.choice_id,
      label: parseLocaleTranslation(record.label),
      outlineCoordinates: parseFloatArray(record.outline_coordinates, 'outline_coordinates'),
      volumeSamples: parseFloatArray(record.volume_samples, 'volume_samples'),
      baseImageUrl: getImageUrl(record.base_image_path),
    };
  }

  const getDrinkScalesV2 = async (drinkwareSetId: string): Promise<DrinkScaleV2Entry[]> => {
    await checkSetId(drinkwareSetId);

    const records = await fetchDrinkScaleV2Records(drinkwareSetId);

    return records.map((record) => formatDrinkScaleV2(drinkwareSetId, record));
  };

  const getDrinkScaleV2 = async (
    drinkwareSetId: string,
    choiceId: string
  ): Promise<DrinkScaleV2Entry | undefined> => {
    await checkSetId(drinkwareSetId);

    const records = await fetchDrinkScaleV2Records(drinkwareSetId, choiceId);

    if (records.length === 0) return undefined;

    return formatDrinkScaleV2(drinkwareSetId, records[0]);
  };

  //#endregion

  const getDrinkScale = async (
    drinkwareSetId: string,
    choiceId: string
  ): Promise<DrinkScaleEntry | DrinkScaleV2Entry> => {
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
  ): Promise<(DrinkScaleEntry | DrinkScaleV2Entry)[]> => {
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
          .deleteFrom('drinkware_scales_v2')
          .where('drinkware_set_id', '=', drinkwareSetId)
          .where('choice_id', '=', choiceId)
          .execute();
      }

      try {
        await kyselyDb.foods
          .insertInto('drinkware_scales_v2')
          .values({
            label: labelJson,
            choice_id: choiceId,
            drinkware_set_id: drinkwareSetId,
            base_image_id: processedImage.id,
            outline_coordinates: outlineCoordinatesJson,
            volume_samples: volumeSamplesJson,
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

  const destroyDrinkScale = async (drinkwareSetId: string, choiceId: string) => {
    const deleteResultV1 = await kyselyDb.foods
      .deleteFrom('drinkware_scales')
      .where('drinkware_set_id', '=', drinkwareSetId)
      .where('choice_id', '=', choiceId)
      .executeTakeFirst();

    const deleteResultV2 = await kyselyDb.foods
      .deleteFrom('drinkware_scales_v2')
      .where('drinkware_set_id', '=', drinkwareSetId)
      .where('choice_id', '=', choiceId)
      .executeTakeFirst();

    return deleteResultV1.numDeletedRows + deleteResultV2.numDeletedRows;
  };

  const destroyAllDrinkScales = async (drinkwareSetId: string) => {
    const deleteResultV1 = await kyselyDb.foods
      .deleteFrom('drinkware_scales')
      .where('drinkware_set_id', '=', drinkwareSetId)
      .executeTakeFirst();

    const deleteResultV2 = await kyselyDb.foods
      .deleteFrom('drinkware_scales_v2')
      .where('drinkware_set_id', '=', drinkwareSetId)
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
