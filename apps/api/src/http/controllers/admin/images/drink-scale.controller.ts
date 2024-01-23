import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { DrinkwareScaleEntry, DrinkwareScaleV2Entry } from '@intake24/common/types/http/admin';
import type { PaginateQuery, User } from '@intake24/db';
import { NotFoundError, ValidationError } from '@intake24/api/http/errors';

const drinkScaleController = ({ drinkwareSetService }: Pick<IoC, 'drinkwareSetService'>) => {
  const browse = async (
    req: Request<{ drinkwareSetId: string }, any, any, PaginateQuery>,
    res: Response<(DrinkwareScaleEntry | DrinkwareScaleV2Entry)[]>
  ): Promise<void> => {
    const { drinkwareSetId } = req.params;

    const scales = await drinkwareSetService.getDrinkScales(drinkwareSetId);

    res.json(scales);
  };

  const read = async (
    req: Request<{ drinkwareSetId: string; choiceId: string }>,
    res: Response<DrinkwareScaleEntry | DrinkwareScaleV2Entry>
  ): Promise<void> => {
    const { drinkwareSetId, choiceId } = req.params;

    const scale = await drinkwareSetService.getDrinkScale(drinkwareSetId, choiceId);

    res.json(scale);
  };

  const store = async (
    req: Request<{ drinkwareSetId: string; choiceId: string }, any, any, { update: string }>,
    res: Response<DrinkwareScaleV2Entry>
  ): Promise<void> => {
    const {
      file,
      body: { label, outlineCoordinates, volumeSamples },
      params: { drinkwareSetId, choiceId },
      query: { update },
    } = req;

    const user = req.user as User;

    if (!file) throw new ValidationError('Drink scale base image file missing.', { path: 'image' });

    await drinkwareSetService.createDrinkScale(
      drinkwareSetId,
      choiceId,
      user.id,
      file,
      label,
      outlineCoordinates,
      volumeSamples,
      update === 'true'
    );

    const scale = await drinkwareSetService.getDrinkScaleV2(drinkwareSetId, choiceId);

    res.json(scale);
  };

  const destroy = async (
    req: Request<{ drinkwareSetId: string; choiceId: string }>
  ): Promise<void> => {
    const { drinkwareSetId, choiceId } = req.params;

    const destroyed = await drinkwareSetService.destroyDrinkScale(drinkwareSetId, choiceId);

    if (destroyed === 0n)
      throw new NotFoundError(
        `Drinkware set ${drinkwareSetId} has no drink scale for object ${choiceId}`
      );
  };

  const destroyAll = async (req: Request<{ drinkwareSetId: string }>): Promise<void> => {
    const { drinkwareSetId } = req.params;

    await drinkwareSetService.destroyAllDrinkScales(drinkwareSetId);
  };

  const refs = async (): Promise<void> => {
    throw new NotFoundError();
  };

  return {
    browse,
    read,
    store,
    destroy,
    destroyAll,
    refs,
  };
};

export default drinkScaleController;

export type DrinkScaleController = ReturnType<typeof drinkScaleController>;
