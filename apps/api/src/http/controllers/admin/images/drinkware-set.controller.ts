import type { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';

import type { IoC } from '@intake24/api/ioc';
import type { Dictionary } from '@intake24/common/types';
import type { DrinkwareSetResponse } from '@intake24/common/types/http';
import type {
  CreateDrinkwareSetInput,
  DrinkwareSetEntry,
  DrinkwareSetsResponse,
  UpdateDrinkwareSetInput,
} from '@intake24/common/types/http/admin';
import type { PaginateQuery, User } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { DrinkwareSet } from '@intake24/db';

export type UpdateDrinkwareSetInputWithFiles = UpdateDrinkwareSetInput & {
  baseImageFiles: Dictionary<Express.Multer.File>;
};

const drinkwareSetController = ({
  drinkwareSetService,
}: Pick<IoC, 'imagesBaseUrl' | 'portionSizeService' | 'drinkwareSetService'>) => {
  const entry = async (
    req: Request<{ drinkwareSetId: string }>,
    res: Response<DrinkwareSetEntry>
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

  const store = async (
    req: Request<CreateDrinkwareSetInput>,
    res: Response<DrinkwareSetEntry>
  ): Promise<void> => {
    await drinkwareSetService.create(req.body);

    const drinkwareSetEntry = await drinkwareSetService.getDrinkwareSetOrThrow(req.body.id);

    res.status(HttpStatusCode.Created).json(drinkwareSetEntry);
  };

  const read = async (
    req: Request<{ drinkwareSetId: string }>,
    res: Response<DrinkwareSetResponse>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ drinkwareSetId: string }>,
    res: Response<DrinkwareSetEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ drinkwareSetId: string }, any, UpdateDrinkwareSetInputWithFiles>,
    res: Response<DrinkwareSetEntry>
  ): Promise<void> => {
    const { drinkwareSetId } = req.params;
    const user = req.user as User;

    await drinkwareSetService.update(drinkwareSetId, user.id, req.body);

    const updated = await drinkwareSetService.getDrinkwareSetOrThrow(drinkwareSetId);

    res.json(updated);
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
