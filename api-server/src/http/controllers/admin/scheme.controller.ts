import { Request, Response } from 'express';
import { pick } from 'lodash';
import { Language, Scheme } from '@/db/models/system';
import { defaultMeals as meals } from '@/db/models/system/scheme';
import { ForbiddenError, NotFoundError } from '@/http/errors';
import {
  CreateSchemeResponse,
  SchemeRefs,
  SchemeResponse,
  SchemesResponse,
  StoreSchemeResponse,
} from '@common/types/http/admin/schemes';
import { Controller, CrudActions } from '../controller';

export type SchemeController = Controller<CrudActions>;

export default (): SchemeController => {
  const refs = async (): Promise<SchemeRefs> => {
    const languages = await Language.findAll();

    return { languages, meals };
  };

  const entry = async (req: Request, res: Response): Promise<void> => {
    const { schemeId } = req.params;
    const scheme = await Scheme.findByPk(schemeId);

    if (!scheme) throw new NotFoundError();

    res.json({ data: scheme, refs: await refs() });
  };

  const list = async (req: Request, res: Response<SchemesResponse>): Promise<void> => {
    const schemes = await Scheme.paginate({ req, columns: ['id', 'name'] });

    res.json(schemes);
  };

  const create = async (req: Request, res: Response<CreateSchemeResponse>): Promise<void> => {
    res.json({ refs: await refs() });
  };

  const store = async (req: Request, res: Response<StoreSchemeResponse>): Promise<void> => {
    const scheme = await Scheme.create(
      pick(req.body, ['id', 'name', 'type', 'questions', 'meals'])
    );

    res.status(201).json({ data: scheme });
  };

  const detail = async (req: Request, res: Response<SchemeResponse>): Promise<void> =>
    entry(req, res);

  const edit = async (req: Request, res: Response<SchemeResponse>): Promise<void> =>
    entry(req, res);

  const update = async (req: Request, res: Response<SchemeResponse>): Promise<void> => {
    const { schemeId } = req.params;
    const scheme = await Scheme.findByPk(schemeId);

    if (!scheme) throw new NotFoundError();

    await scheme.update(pick(req.body, ['name', 'type', 'questions', 'meals']));

    res.json({ data: scheme, refs: await refs() });
  };

  const destroy = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { schemeId } = req.params;
    const scheme = await Scheme.scope('surveys').findByPk(schemeId);

    if (!scheme) throw new NotFoundError();

    if (scheme.surveys?.length)
      throw new ForbiddenError('Scheme cannot be deleted. There are surveys using this scheme.');

    await scheme.destroy();
    res.status(204).json();
  };

  return {
    list,
    create,
    store,
    detail,
    edit,
    update,
    destroy,
  };
};
