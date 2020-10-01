import { Request, Response, NextFunction } from 'express';
import { pick } from 'lodash';
import { Language, Scheme } from '@/db/models/system';
import { defaultMeals as meals } from '@/db/models/system/scheme';
import { ForbiddenError, NotFoundError } from '@/http/errors';
import {
  SchemeCreateResponse,
  SchemeEntryRefs,
  SchemeEntryResponse,
  SchemeListResponse,
  SchemeStoreResponse,
} from '@common/types/api/admin/schemes';

const refs = async (): Promise<SchemeEntryRefs> => {
  const languages = await Language.findAll();

  return { languages, meals };
};

const entry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { schemeId } = req.params;
  const scheme = await Scheme.findByPk(schemeId);

  if (!scheme) {
    next(new NotFoundError());
    return;
  }

  res.json({ data: scheme, refs: await refs() });
};

export default {
  async list(req: Request, res: Response<SchemeListResponse>): Promise<void> {
    const schemes = await Scheme.paginate({ req, columns: ['id', 'name'] });

    res.json(schemes);
  },

  async create(req: Request, res: Response<SchemeCreateResponse>): Promise<void> {
    res.json({ refs: await refs() });
  },

  async store(req: Request, res: Response<SchemeStoreResponse>): Promise<void> {
    const scheme = await Scheme.create(
      pick(req.body, ['id', 'name', 'type', 'questions', 'meals'])
    );

    res.status(201).json({ data: scheme });
  },

  async detail(
    req: Request,
    res: Response<SchemeEntryResponse>,
    next: NextFunction
  ): Promise<void> {
    entry(req, res, next);
  },

  async edit(req: Request, res: Response<SchemeEntryResponse>, next: NextFunction): Promise<void> {
    entry(req, res, next);
  },

  async update(
    req: Request,
    res: Response<SchemeEntryResponse>,
    next: NextFunction
  ): Promise<void> {
    const { schemeId } = req.params;
    const scheme = await Scheme.findByPk(schemeId);

    if (!scheme) {
      next(new NotFoundError());
      return;
    }

    await scheme.update(pick(req.body, ['name', 'type', 'questions', 'meals']));

    res.json({ data: scheme, refs: await refs() });
  },

  async delete(req: Request, res: Response<undefined>, next: NextFunction): Promise<void> {
    const { schemeId } = req.params;
    const scheme = await Scheme.scope('surveys').findByPk(schemeId);

    if (!scheme) {
      next(new NotFoundError());
      return;
    }

    if (scheme.surveys?.length) {
      next(new ForbiddenError('Scheme cannot be deleted. There are surveys using this scheme.'));
      return;
    }

    await scheme.destroy();
    res.status(204).json();
  },
};
