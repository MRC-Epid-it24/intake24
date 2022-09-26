import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type {
  NutrientTypeEntry,
  NutrientTypeRefs,
  NutrientTypesResponse,
} from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { FoodsNutrientType, FoodsNutrientUnit } from '@intake24/db';

import { toNutrientTypeResponse } from '../../responses/admin';

const nutrientTypeController = ({ nutrientTypeService }: Pick<IoC, 'nutrientTypeService'>) => {
  const entry = async (
    req: Request<{ nutrientTypeId: string }>,
    res: Response<NutrientTypeEntry>
  ): Promise<void> => {
    const { nutrientTypeId } = req.params;

    const nutrientType = await nutrientTypeService.getNutrientType(nutrientTypeId);

    res.json(toNutrientTypeResponse(nutrientType));
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<NutrientTypesResponse>
  ): Promise<void> => {
    const nutrientTypes = await FoodsNutrientType.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['description'],
      include: [{ association: 'unit', attributes: ['description'] }],
      order: [['id', 'ASC']],
    });

    res.json(nutrientTypes);
  };

  const store = async (req: Request, res: Response<NutrientTypeEntry>): Promise<void> => {
    const nutrientType = await nutrientTypeService.createNutrientType(
      pick(req.body, ['id', 'unitId', 'description', 'unitId', 'kcalPerUnit'])
    );

    res.status(201).json(toNutrientTypeResponse(nutrientType));
  };

  const read = async (
    req: Request<{ nutrientTypeId: string }>,
    res: Response<NutrientTypeEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ nutrientTypeId: string }>,
    res: Response<NutrientTypeEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ nutrientTypeId: string }>,
    res: Response<NutrientTypeEntry>
  ): Promise<void> => {
    const { nutrientTypeId } = req.params;

    const nutrientType = await nutrientTypeService.updateNutrientType(
      nutrientTypeId,
      pick(req.body, ['description', 'unitId', 'kcalPerUnit'])
    );

    res.json(toNutrientTypeResponse(nutrientType));
  };

  const destroy = async (
    req: Request<{ nutrientTypeId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { nutrientTypeId } = req.params;

    await nutrientTypeService.deleteNutrientType(nutrientTypeId);

    res.status(204).json();
  };

  const refs = async (req: Request, res: Response<NutrientTypeRefs>): Promise<void> => {
    const units = await FoodsNutrientUnit.findAll();

    res.json({ units });
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

export default nutrientTypeController;

export type NutrientTypeController = ReturnType<typeof nutrientTypeController>;
