import { Request, Response } from 'express';
import { pick } from 'lodash';
import { Op } from 'sequelize';
import {
  CreateLocaleResponse,
  LocaleRefs,
  LocaleResponse,
  LocalesResponse,
  StoreLocaleResponse,
} from '@common/types/http/admin';
import { Locale as FoodsLocale } from '@api/db/models/foods';
import { Language, Locale as SystemLocale } from '@api/db/models/system';
import { ForbiddenError, NotFoundError } from '@api/http/errors';
import { Controller, CrudActions } from '../controller';

export type LocaleController = Controller<CrudActions>;

export default (): LocaleController => {
  const refs = async (localeId?: string): Promise<LocaleRefs> => {
    const [languages, locales] = await Promise.all([
      Language.findAll(),
      SystemLocale.findAll({ where: localeId ? { id: { [Op.ne]: localeId } } : {} }),
    ]);

    return { languages, locales };
  };

  const entry = async (req: Request, res: Response<LocaleResponse>): Promise<void> => {
    const { localeId } = req.params;

    const [systemLocale, foodsLocale] = await Promise.all([
      SystemLocale.findByPk(localeId),
      FoodsLocale.findByPk(localeId),
    ]);
    if (!systemLocale || !foodsLocale) throw new NotFoundError();

    res.json({ data: systemLocale, refs: await refs(systemLocale.id) });
  };

  const browse = async (req: Request, res: Response<LocalesResponse>): Promise<void> => {
    const locales = await SystemLocale.paginate({
      req,
      columns: ['id', 'englishName', 'localName'],
      order: [['id', 'ASC']],
    });

    res.json(locales);
  };

  const create = async (req: Request, res: Response<CreateLocaleResponse>): Promise<void> => {
    res.json({ refs: await refs() });
  };

  const store = async (req: Request, res: Response<StoreLocaleResponse>): Promise<void> => {
    const input = pick(req.body, [
      'id',
      'englishName',
      'localName',
      'respondentLanguageId',
      'adminLanguageId',
      'countryFlagCode',
      'prototypeLocaleId',
      'textDirection',
    ]);

    const [locale] = await Promise.all([SystemLocale.create(input), FoodsLocale.create(input)]);

    res.status(201).json({ data: locale });
  };

  const read = async (req: Request, res: Response<LocaleResponse>): Promise<void> =>
    entry(req, res);

  const edit = async (req: Request, res: Response<LocaleResponse>): Promise<void> =>
    entry(req, res);

  const update = async (req: Request, res: Response<LocaleResponse>): Promise<void> => {
    const { localeId } = req.params;

    const [systemLocale, foodsLocale] = await Promise.all([
      SystemLocale.findByPk(localeId),
      FoodsLocale.findByPk(localeId),
    ]);
    if (!systemLocale || !foodsLocale) throw new NotFoundError();

    const input = pick(req.body, [
      'englishName',
      'localName',
      'respondentLanguageId',
      'adminLanguageId',
      'countryFlagCode',
      'prototypeLocaleId',
      'textDirection',
    ]);

    await Promise.all([systemLocale.update(input), foodsLocale.update(input)]);

    res.json({ data: systemLocale, refs: await refs(systemLocale.id) });
  };

  const destroy = async (req: Request /* , res: Response<undefined> */): Promise<void> => {
    const { localeId } = req.params;

    const [systemLocale, foodsLocale] = await Promise.all([
      SystemLocale.findByPk(localeId),
      FoodsLocale.findByPk(localeId),
    ]);
    if (!systemLocale || !foodsLocale) throw new NotFoundError();

    if (systemLocale.surveys?.length)
      throw new ForbiddenError('Locale cannot be deleted. There are surveys using this locale.');

    // TODO: implement locale deletion -> check what needs to be deleted in food DB
    // Food DB locale record + all local food records
    throw new ForbiddenError('Locale cannot be deleted.');

    // await Promise.all([systemLocale.destroy(), foodsLocale.destroy()]);
    // res.status(204).json();
  };

  return {
    browse,
    create,
    store,
    read,
    edit,
    update,
    destroy,
  };
};
