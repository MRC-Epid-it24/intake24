import { Request, Response, NextFunction } from 'express';
import Locale from '@/db/models/system/locale';
import NotFoundError from '@/http/errors/not-found.error';

const entry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const locale = await Locale.findByPk(id);

  if (!locale) {
    next(new NotFoundError());
    return;
  }

  res.json({ data: locale, refs: {} });
};

export default {
  async list(req: Request, res: Response): Promise<void> {
    const { data, meta } = await Locale.paginate({
      req,
      columns: ['id', 'englishName', 'localName'],
    });

    res.json({ data, meta });
  },

  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    entry(req, res, next);
  },
};
