import { Request, Response } from 'express';
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
} from '@common/types/http';
import { Controller, CrudActions } from '../controller';

export type LocaleController = Controller<CrudActions>;

export default (): LocaleController => {
  const refs = async (localeId: string | undefined = undefined): Promise<LocaleRefs> => {
    const languages = await Language.findAll();
    const locales = await Locale.findAll({ where: localeId ? { id: { [Op.ne]: localeId } } : {} });

    return { languages, locales };
  };

  const entry = async (req: Request, res: Response<LocaleResponse>): Promise<void> => {
    const { localeId } = req.params;
    const locale = await Locale.findByPk(localeId);

    if (!locale) throw new NotFoundError();

    res.json({ data: locale, refs: await refs(locale.id) });
  };

  const browse = async (req: Request, res: Response<LocalesResponse>): Promise<void> => {
    const locales = await Locale.paginate({
      req,
      columns: ['id', 'englishName', 'localName'],
    });

    res.json(locales);
  };

  const create = async (req: Request, res: Response<CreateLocaleResponse>): Promise<void> => {
    res.json({ refs: await refs() });
  };

  const store = async (req: Request, res: Response<StoreLocaleResponse>): Promise<void> => {
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
  };

  const detail = async (req: Request, res: Response<LocaleResponse>): Promise<void> =>
    entry(req, res);

  const edit = async (req: Request, res: Response<LocaleResponse>): Promise<void> =>
    entry(req, res);

  const update = async (req: Request, res: Response<LocaleResponse>): Promise<void> => {
    const { localeId } = req.params;
    const locale = await Locale.findByPk(localeId);

    if (!locale) throw new NotFoundError();

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
  };

  const destroy = async (req: Request /* , res: Response<undefined> */): Promise<void> => {
    const { localeId } = req.params;
    const locale = await Locale.scope('surveys').findByPk(localeId);

    if (!locale) throw new NotFoundError();

    if (locale.surveys?.length)
      throw new ForbiddenError('Locale cannot be deleted. There are surveys using this locale.');

    // TODO: implement locale deletion -> check what needs to be deleted in food DB
    // Food DB locale record + all local food records
    throw new ForbiddenError('Locale cannot be deleted.');

    // await locale.destroy();
    // res.status(204).json();
  };

  return {
    browse,
    create,
    store,
    detail,
    edit,
    update,
    destroy,
  };
};
