import { Request, Response } from 'express';
import {
  CreateNutrientTableResponse,
  JobResponse,
  NutrientTableInput,
  NutrientTableRefs,
  NutrientTableResponse,
  NutrientTablesResponse,
  StoreNutrientTableResponse,
} from '@common/types/http/admin';
import { NutrientType, NutrientTable } from '@api/db/models/foods';
import type { IoC } from '@api/ioc';
import { ValidationError } from '@api/http/errors';
import { User } from '@api/db/models/system';
import { Controller, CrudActions } from '../controller';

export type NutrientTableController = Controller<CrudActions | 'upload'>;

export default ({
  nutrientTableService,
}: Pick<IoC, 'nutrientTableService'>): NutrientTableController => {
  const refs = async (): Promise<NutrientTableRefs> => {
    const nutrients = await NutrientType.findAll({ order: [['id', 'ASC']] });

    return { nutrients };
  };

  const entry = async (
    req: Request<{ nutrientTableId: string }>,
    res: Response<NutrientTableResponse>
  ): Promise<void> => {
    const { nutrientTableId } = req.params;

    const data = await nutrientTableService.getTable(nutrientTableId);

    res.json({ data, refs: await refs() });
  };

  const browse = async (req: Request, res: Response<NutrientTablesResponse>): Promise<void> => {
    const nutrientTables = await NutrientTable.paginate({
      req,
      columns: ['id', 'description'],
      order: [['id', 'ASC']],
    });

    res.json(nutrientTables);
  };

  const create = async (
    req: Request,
    res: Response<CreateNutrientTableResponse>
  ): Promise<void> => {
    res.json({ refs: await refs() });
  };

  const store = async (
    req: Request<any, any, NutrientTableInput>,
    res: Response<StoreNutrientTableResponse>
  ): Promise<void> => {
    const data = await nutrientTableService.createTable(req.body);

    res.status(201).json({ data });
  };

  const read = async (
    req: Request<{ nutrientTableId: string }>,
    res: Response<NutrientTableResponse>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ nutrientTableId: string }>,
    res: Response<NutrientTableResponse>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ nutrientTableId: string }, any, NutrientTableInput>,
    res: Response<NutrientTableResponse>
  ): Promise<void> => {
    const { nutrientTableId } = req.params;

    const data = await nutrientTableService.updateTable(nutrientTableId, req.body);

    res.json({ data, refs: await refs() });
  };

  const destroy = async (
    req: Request<{ nutrientTableId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { nutrientTableId } = req.params;

    await nutrientTableService.deleteTable(nutrientTableId);

    res.status(204).json();
  };

  const upload = async (
    req: Request<{ nutrientTableId: string }>,
    res: Response<JobResponse>
  ): Promise<void> => {
    const {
      file,
      params: { nutrientTableId },
      body: { type },
    } = req;
    const { id: userId } = req.user as User;

    if (!file) throw new ValidationError('file', 'Missing file.');

    const data = await nutrientTableService.uploadCsvFile(nutrientTableId, {
      type,
      file: file.path,
      userId,
    });

    res.json({ data });
  };

  return {
    browse,
    create,
    store,
    read,
    edit,
    update,
    destroy,
    upload,
  };
};
