import { Request, Response, NextFunction } from 'express';
import { Locale } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';

const entry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { localeId } = req.params;
  const locale = await Locale.findByPk(localeId);

  if (!locale) {
    next(new NotFoundError());
    return;
  }

  res.json({ data: locale, refs: {} });
};

export default {
  async list(req: Request, res: Response): Promise<void> {
    const locales = await Locale.paginate({
      req,
      columns: ['id', 'englishName', 'localName'],
    });

    res.json(locales);
  },

  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    entry(req, res, next);
  },
};
