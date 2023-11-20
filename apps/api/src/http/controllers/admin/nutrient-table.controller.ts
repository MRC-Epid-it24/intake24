import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type {
  JobEntry,
  NutrientTableEntry,
  NutrientTableInput,
  NutrientTableRefs,
  NutrientTablesResponse,
} from '@intake24/common/types/http/admin';
import type { PaginateQuery, User } from '@intake24/db';
import { NotFoundError, ValidationError } from '@intake24/api/http/errors';
import { jobRequiresFile, pickJobParams } from '@intake24/common/types';
import { FoodsNutrientType, NutrientTable } from '@intake24/db';

const nutrientTableController = ({ nutrientTableService }: Pick<IoC, 'nutrientTableService'>) => {
  const entry = async (
    req: Request<{ nutrientTableId: string }>,
    res: Response<NutrientTableEntry>
  ): Promise<void> => {
    const { nutrientTableId } = req.params;

    const nutrientTable = await nutrientTableService.getTable(nutrientTableId);

    res.json(nutrientTable);
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<NutrientTablesResponse>
  ): Promise<void> => {
    const nutrientTables = await NutrientTable.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'description'],
      order: [['id', 'ASC']],
    });

    res.json(nutrientTables);
  };

  const store = async (
    req: Request<any, any, NutrientTableInput>,
    res: Response<NutrientTableEntry>
  ): Promise<void> => {
    const nutrientTable = await nutrientTableService.createTable(req.body);

    res.status(201).json(nutrientTable);
  };

  const read = async (
    req: Request<{ nutrientTableId: string }>,
    res: Response<NutrientTableEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ nutrientTableId: string }>,
    res: Response<NutrientTableEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ nutrientTableId: string }, any, NutrientTableInput>,
    res: Response<NutrientTableEntry>
  ): Promise<void> => {
    const { nutrientTableId } = req.params;

    const nutrientTable = await nutrientTableService.updateTable(nutrientTableId, req.body);

    res.json(nutrientTable);
  };

  const destroy = async (
    req: Request<{ nutrientTableId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { nutrientTableId } = req.params;

    await nutrientTableService.deleteTable(nutrientTableId);

    res.status(204).json();
  };

  const refs = async (req: Request, res: Response<NutrientTableRefs>): Promise<void> => {
    const nutrientTypes = await FoodsNutrientType.scope('list').findAll();

    res.json({ nutrientTypes });
  };

  const tasks = async (
    req: Request<{ nutrientTableId: string }>,
    res: Response<JobEntry>
  ): Promise<void> => {
    const {
      file,
      params: { nutrientTableId },
      body: { type },
    } = req;
    const { id: userId } = req.user as User;

    const nutrientTable = await NutrientTable.findByPk(nutrientTableId);
    if (!nutrientTable) throw new NotFoundError();

    const params = { ...pickJobParams(req.body, type), nutrientTableId };
    if (jobRequiresFile(type)) {
      if (!file) throw new ValidationError('Missing file.', { path: 'params.file' });

      params.file = file.path;
    }

    const job = await nutrientTableService.queueTask({ userId, type, params });

    res.json(job);
  };

  return {
    browse,
    store,
    read,
    edit,
    update,
    destroy,
    refs,
    tasks,
  };
};

export default nutrientTableController;

export type NutrientTableController = ReturnType<typeof nutrientTableController>;
