import { Request, Response, NextFunction } from 'express';
import { pick } from 'lodash';
import { Op } from 'sequelize';
import { Language, Locale } from '@/db/models/system';
import { ForbiddenError, NotFoundError } from '@/http/errors';
import {
  CreateLocaleResponse,
  LocaleRefs,
  LocaleResponse,
  LocalesResponse,
  StoreLocaleResponse,
} from '@common/types/http/admin/locales';

const refs = async (localeId: string | undefined = undefined): Promise<LocaleRefs> => {
  const languages = await Language.findAll();
  const locales = await Locale.findAll({ where: localeId ? { id: { [Op.ne]: localeId } } : {} });

  return { languages, locales };
};

const entry = async (
  req: Request,
  res: Response<LocaleResponse>,
  next: NextFunction
): Promise<void> => {
  const { localeId } = req.params;
  const locale = await Locale.findByPk(localeId);

  if (!locale) {
    next(new NotFoundError());
    return;
  }

  res.json({ data: locale, refs: await refs(locale.id) });
};

export default {
  async list(req: Request, res: Response<LocalesResponse>): Promise<void> {
    const locales = await Locale.paginate({
      req,
      columns: ['id', 'englishName', 'localName'],
    });

    res.json(locales);
  },

  async create(req: Request, res: Response<CreateLocaleResponse>): Promise<void> {
    res.json({ refs: await refs() });
  },

  async store(req: Request, res: Response<StoreLocaleResponse>): Promise<void> {
    const locale = await Locale.create(
      pick(req.body, [
        'id',
        'englishName',
        'localName',
        'respondentLanguageId',
        'adminLanguageId',
        'countryFlagCode',
        'prototypeLocaleId',
        'textDirection',
      ])
    );

    res.status(201).json({ data: locale });
  },

  async detail(req: Request, res: Response<LocaleResponse>, next: NextFunction): Promise<void> {
    entry(req, res, next);
  },

  async edit(req: Request, res: Response<LocaleResponse>, next: NextFunction): Promise<void> {
    entry(req, res, next);
  },

  async update(req: Request, res: Response<LocaleResponse>, next: NextFunction): Promise<void> {
    const { localeId } = req.params;
    const locale = await Locale.findByPk(localeId);

    if (!locale) {
      next(new NotFoundError());
      return;
    }

    await locale.update(
      pick(req.body, [
        'englishName',
        'localName',
        'respondentLanguageId',
        'adminLanguageId',
        'countryFlagCode',
        'prototypeLocaleId',
        'textDirection',
      ])
    );

    res.json({ data: locale, refs: await refs(locale.id) });
  },

  async delete(req: Request, res: Response<undefined>, next: NextFunction): Promise<void> {
    const { localeId } = req.params;
    const locale = await Locale.scope('surveys').findByPk(localeId);

    if (!locale) {
      next(new NotFoundError());
      return;
    }

    if (locale.surveys?.length) {
      next(new ForbiddenError('Locale cannot be deleted. There are surveys using this locale.'));
      return;
    }

    // TODO: implement locale deletion -> check what needs to be deleted in food DB
    // Food DB locale record + all local food records
    next(new ForbiddenError('Locale cannot be deleted.'));

    // await locale.destroy();
    // res.status(204).json();
  },
};
