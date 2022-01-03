import { Request, Response } from 'express';
import {
  NutrientTableInput,
  NutrientTableEntry,
  NutrientTableRefs,
  NutrientTablesResponse,
  JobEntry,
} from '@common/types/http/admin';
import { FoodsNutrientType, NutrientTable, User, PaginateQuery } from '@api/db';
import type { IoC } from '@api/ioc';
import { ValidationError } from '@api/http/errors';
import { pick } from 'lodash';
import { Controller, CrudActions } from '../controller';

export type NutrientTableController = Controller<CrudActions | 'upload'>;

export default ({
  nutrientTableService,
}: Pick<IoC, 'nutrientTableService'>): NutrientTableController => {
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
    const nutrients = await FoodsNutrientType.findAll({ order: [['id', 'ASC']] });

    res.json({ nutrients });
  };

  const upload = async (
    req: Request<{ nutrientTableId: string }>,
    res: Response<JobEntry>
  ): Promise<void> => {
    const {
      file,
      params: { nutrientTableId },
      body: { type },
    } = req;
    const { id: userId } = req.user as User;

    if (!file) throw new ValidationError('file', 'Missing file.');

    const job = await nutrientTableService.uploadCsvFile(nutrientTableId, {
      type,
      file: file.path,
      userId,
    });

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
    upload,
  };
};
