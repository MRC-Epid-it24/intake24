import { groupBy, mapValues } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { LocaleTranslation } from '@intake24/common/types';
import type {
  CreateDrinkwareSetInput,
  DrinkScaleEntry,
  UpdateDrinkwareSetInput,
} from '@intake24/common/types/http/admin';
import { NotFoundError } from '@intake24/api/http/errors';
import { DrinkwareSet, ImageMap } from '@intake24/db';

const drinkwareSetService = ({
  portionSizeService,
  kyselyDb,
  imagesBaseUrl,
  logger,
}: Pick<IoC, 'kyselyDb' | 'imagesBaseUrl' | 'logger' | 'portionSizeService'>) => {
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

  /**
   * Get all drink scales for a drinkware set
   *
   * @param {string} id
   * @returns {Promise<DrinkwareSet>}
   */
  const getDrinkScales = async (drinkwareSetId: string): Promise<DrinkScaleEntry[]> => {
    const setId = await kyselyDb.foods
      .selectFrom('drinkware_sets')
      .select('drinkware_sets.id')
      .where('drinkware_sets.id', '=', drinkwareSetId)
      .execute();

    if (setId.length === 0) throw new NotFoundError(`Drinkware set "${drinkwareSetId}" not found`);

    const scales = await kyselyDb.foods
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
      .where('drinkware_set_id', '=', drinkwareSetId)
      .orderBy('choice_id')
      .execute();

    const volumeSampleRecords = await kyselyDb.foods
      .selectFrom('drinkware_volume_samples')
      .select(['drinkware_scale_id', 'fill', 'volume'])
      .where(
        'drinkware_scale_id',
        'in',
        scales.map((s) => s.id)
      )
      .execute();

    // Convert from a list of records (scale_id, fill, volume) to a map scale_id -> number[],
    // where the numbers are a flattened list of (fill, volume) pairs

    const volumeSamples = mapValues(
      groupBy(volumeSampleRecords, (r) => r.drinkware_scale_id),
      (grouped) => grouped.flatMap((r) => [r.fill, r.volume])
    );

    return scales.map((record) => ({
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

  return {
    getDrinkScales,
    create,
    update,
    destroy,
  };
};

export default drinkwareSetService;

export type DrinkwareSetService = ReturnType<typeof drinkwareSetService>;
