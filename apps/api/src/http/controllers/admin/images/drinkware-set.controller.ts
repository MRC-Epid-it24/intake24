import type { Request, Response } from 'express';
import { pick } from 'lodash';
import { col, fn } from 'sequelize';

import type { IoC } from '@intake24/api/ioc';
import type { DrinkwareSetResponse } from '@intake24/common/types/http';
import type { DrinkwareSetEntry, DrinkwareSetsResponse } from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import imagesResponseCollection from '@intake24/api/http/responses/admin/images';
import { DrinkwareSet } from '@intake24/db';

const drinkwareSetController = ({
  imagesBaseUrl,
  portionSizeService,
  drinkwareSetService,
}: Pick<IoC, 'imagesBaseUrl' | 'portionSizeService' | 'drinkwareSetService'>) => {
  const responseCollection = imagesResponseCollection(imagesBaseUrl);

  const entry = async (
    req: Request<{ drinkwareSetId: string }>,
    res: Response<DrinkwareSetResponse>
  ): Promise<void> => {
    const { drinkwareSetId } = req.params;

    const drinkwareSet = await drinkwareSetService.getDrinkwareSet(drinkwareSetId);
    if (!drinkwareSet) throw new NotFoundError();

    res.json(drinkwareSet);
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<DrinkwareSetsResponse>
  ): Promise<void> => {
    const drinkwareSets = await drinkwareSetService.getDrinkwareSets(req.query);

    res.json(drinkwareSets);
  };

  const store = async (req: Request, res: Response<DrinkwareSetEntry>): Promise<void> => {
    const { id, description, imageMapId } = req.body;

    await DrinkwareSet.create({ id, description, imageMapId });

    const drinkwareSet = await drinkwareSetService.getDrinkwareSet(id);
    if (!drinkwareSet) throw new NotFoundError();

    res.status(201).json(drinkwareSet);
  };

  const read = async (
    req: Request<{ drinkwareSetId: string }>,
    res: Response<DrinkwareSetResponse>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ drinkwareSetId: string }>,
    res: Response<DrinkwareSetResponse>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ drinkwareSetId: string }>,
    res: Response<DrinkwareSetResponse>
  ): Promise<void> => {
    const { drinkwareSetId } = req.params;

    const drinkwareSet = await DrinkwareSet.findByPk(drinkwareSetId);
    if (!drinkwareSet) throw new NotFoundError();

    const { description } = req.body;

    await drinkwareSet.update({ description });

    // Temp hack
    const drinkwareSet2 = await drinkwareSetService.getDrinkwareSet(drinkwareSetId);
    if (!drinkwareSet2) throw new NotFoundError();

    res.json(drinkwareSet2);
  };

  const destroy = async (
    req: Request<{ drinkwareSetId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { drinkwareSetId } = req.params;

    const drinkwareSet = await DrinkwareSet.findByPk(drinkwareSetId, { attributes: ['id'] });
    if (!drinkwareSet) throw new NotFoundError();

    await drinkwareSet.destroy();

    res.status(204).json();
  };

  const refs = async (): Promise<void> => {
    throw new NotFoundError();
  };

  return {
    browse,
    store,
    read,
    edit,
    update,
    destroy,
    refs,
  };
};

export default drinkwareSetController;

export type DrinkwareSetController = ReturnType<typeof drinkwareSetController>;
