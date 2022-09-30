import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { LocaleEntry, LocaleRefs, LocalesResponse } from '@intake24/common/types/http/admin';
import type { Job, PaginateQuery, User } from '@intake24/db';
import { ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import { pickJobParams } from '@intake24/common/types';
import { FoodIndexBackend, FoodsLocale, Language, SystemLocale } from '@intake24/db';

const localeController = ({ localeService }: Pick<IoC, 'localeService'>) => {
  const entry = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleEntry>
  ): Promise<void> => {
    const { localeId } = req.params;

    const [systemLocale, foodsLocale] = await Promise.all([
      SystemLocale.findByPk(localeId),
      FoodsLocale.findByPk(localeId),
    ]);
    if (!systemLocale || !foodsLocale) throw new NotFoundError();

    res.json(systemLocale);
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<LocalesResponse>
  ): Promise<void> => {
    const locales = await SystemLocale.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'englishName', 'localName'],
      order: [['id', 'ASC']],
    });

    res.json(locales);
  };

  const store = async (req: Request, res: Response<LocaleEntry>): Promise<void> => {
    const input = pick(req.body, [
      'id',
      'englishName',
      'localName',
      'respondentLanguageId',
      'adminLanguageId',
      'countryFlagCode',
      'prototypeLocaleId',
      'textDirection',
      'foodIndexLanguageBackendId',
    ]);

    const [locale] = await Promise.all([SystemLocale.create(input), FoodsLocale.create(input)]);

    res.status(201).json(locale);
  };

  const read = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleEntry>
  ): Promise<void> => {
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
      'foodIndexLanguageBackendId',
    ]);

    await Promise.all([systemLocale.update(input), foodsLocale.update(input)]);

    res.json(systemLocale);
  };

  const destroy = async (
    req: Request<{ localeId: string }> /* , res: Response<undefined> */
  ): Promise<void> => {
    const { localeId } = req.params;

    const [systemLocale, foodsLocale] = await Promise.all([
      SystemLocale.scope('surveys').findByPk(localeId),
      FoodsLocale.findByPk(localeId),
    ]);
    if (!systemLocale || !systemLocale.surveys || !foodsLocale) throw new NotFoundError();

    if (systemLocale.surveys.length)
      throw new ForbiddenError('Locale cannot be deleted. There are surveys using this locale.');

    // TODO: implement locale deletion -> check what needs to be deleted in food DB
    // Food DB locale record + all local food records
    throw new ForbiddenError('Locale cannot be deleted.');

    // await Promise.all([systemLocale.destroy(), foodsLocale.destroy()]);
    // res.status(204).json();
  };

  const refs = async (req: Request, res: Response<LocaleRefs>): Promise<void> => {
    const [languages, locales, foodIndexLanguageBackends] = await Promise.all([
      Language.scope('list').findAll(),
      SystemLocale.scope('list').findAll(),
      FoodIndexBackend.scope('list').findAll(),
    ]);

    res.json({ languages, locales, foodIndexLanguageBackends });
  };

  const tasks = async (req: Request<{ localeId: string }>, res: Response<Job>): Promise<void> => {
    const {
      body: { job, params },
      params: { localeId },
    } = req;
    const { id: userId } = req.user as User;

    const locale = await SystemLocale.findByPk(localeId);
    if (!locale) throw new NotFoundError();

    const jobEntry = await localeService.queueLocaleTask({
      userId,
      job,
      params: { ...pickJobParams(params, job), sourceLocaleId: localeId },
    });

    res.json(jobEntry);
  };

  return {
    browse,
    store,
    read,
    edit,
    update,
    destroy,
    refs,
    tasks,
  };
};

export default localeController;

export type LocaleController = ReturnType<typeof localeController>;
