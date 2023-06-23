import type { IoC } from '@intake24/api/ioc';
import type {
  CreateDrinkwareSetInput,
  UpdateDrinkwareSetInput,
} from '@intake24/common/types/http/admin';
import { NotFoundError } from '@intake24/api/http/errors';
import { DrinkwareSet, ImageMap } from '@intake24/db';

const drinkwareSetService = ({ portionSizeService }: Pick<IoC, 'portionSizeService'>) => {
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
    const drinkwareSet = await DrinkwareSet.findByPk(drinkwareSetId);
    if (!drinkwareSet) throw new NotFoundError();

    await drinkwareSet.destroy();
  };

  return {
    create,
    update,
    destroy,
  };
};

export default drinkwareSetService;

export type DrinkwareSetService = ReturnType<typeof drinkwareSetService>;
