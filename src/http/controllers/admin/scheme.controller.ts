import { Request, Response, NextFunction } from 'express';
import { pick } from 'lodash';
import Scheme, { defaultMeals as meals } from '@/db/models/system/scheme';
import ForbiddenError from '@/http/errors/forbidden.error';
import NotFoundError from '@/http/errors/not-found.error';

const entry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const scheme = await Scheme.findByPk(id);

  if (!scheme) {
    next(new NotFoundError());
    return;
  }

  res.json({ data: scheme, refs: { meals } });
};

export default {
  async list(req: Request, res: Response): Promise<void> {
    const { data, meta } = await Scheme.paginate({ req, columns: ['id'] });

    res.json({ data, meta });
  },

  async create(req: Request, res: Response): Promise<void> {
    res.json({ data: { id: null }, refs: {} });
  },

  async store(req: Request, res: Response): Promise<void> {
    const scheme = await Scheme.create(
      pick(req.body, ['id', 'name', 'type', 'questions', 'meals'])
    );

    res.status(201).json({ data: scheme });
  },

  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    entry(req, res, next);
  },

  async edit(req: Request, res: Response, next: NextFunction): Promise<void> {
    entry(req, res, next);
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const scheme = await Scheme.findByPk(id);

    if (!scheme) {
      next(new NotFoundError());
      return;
    }

    await scheme.update(pick(req.body, ['name', 'type', 'questions', 'meals']));

    res.json({ data: scheme, refs: {} });
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const scheme = await Scheme.scope('surveys').findByPk(id);

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
