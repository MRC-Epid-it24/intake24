import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { NutrientUnitEntry, NutrientUnitsResponse } from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { FoodsNutrientUnit } from '@intake24/db';

const nutrientUnitController = ({ nutrientUnitService }: Pick<IoC, 'nutrientUnitService'>) => {
  const entry = async (
    req: Request<{ nutrientUnitId: string }>,
    res: Response<NutrientUnitEntry>
  ): Promise<void> => {
    const { nutrientUnitId } = req.params;

    const nutrientUnit = await nutrientUnitService.getNutrientUnit(nutrientUnitId);

    res.json(nutrientUnit);
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<NutrientUnitsResponse>
  ): Promise<void> => {
    const nutrientUnits = await FoodsNutrientUnit.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['description'],
      order: [['id', 'ASC']],
    });

    res.json(nutrientUnits);
  };

  const store = async (req: Request, res: Response<NutrientUnitEntry>): Promise<void> => {
    const nutrientUnit = await nutrientUnitService.createNutrientUnit(
      pick(req.body, ['id', 'description', 'symbol'])
    );

    res.status(201).json(nutrientUnit);
  };

  const read = async (
    req: Request<{ nutrientUnitId: string }>,
    res: Response<NutrientUnitEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ nutrientUnitId: string }>,
    res: Response<NutrientUnitEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ nutrientUnitId: string }>,
    res: Response<NutrientUnitEntry>
  ): Promise<void> => {
    const { nutrientUnitId } = req.params;

    const nutrientUnit = await nutrientUnitService.updateNutrientUnit(
      nutrientUnitId,
      pick(req.body, ['description', 'symbol'])
    );

    res.json(nutrientUnit);
  };

  const destroy = async (
    req: Request<{ nutrientUnitId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { nutrientUnitId } = req.params;

    await nutrientUnitService.deleteNutrientUnit(nutrientUnitId);

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

export default nutrientUnitController;

export type NutrientUnitController = ReturnType<typeof nutrientUnitController>;
