import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type {
  JobEntry,
  LocaleEntry,
  LocaleRefs,
  LocalesResponse,
} from '@intake24/common/types/http/admin';
import type { Job, PaginateOptions, PaginateQuery, User } from '@intake24/db';
import { ForbiddenError, NotFoundError, ValidationError } from '@intake24/api/http/errors';
import { localeResponse } from '@intake24/api/http/responses/admin';
import { pickJobParams } from '@intake24/common/types';
import {
  FoodIndexBackend,
  FoodsLocale,
  Language,
  Op,
  securableScope,
  SystemLocale,
} from '@intake24/db';

import { getAndCheckAccess, securableController } from '../securable.controller';

const localeController = (ioc: IoC) => {
  const { localeService } = ioc;

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<LocalesResponse>
  ): Promise<void> => {
    const { aclService, userId } = req.scope.cradle;

    const paginateOptions: PaginateOptions = {
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'englishName', 'localName'],
      order: [['id', 'ASC']],
    };

    if (await aclService.hasPermission('locales|browse')) {
      const locales = await SystemLocale.paginate(paginateOptions);
      res.json(locales);
      return;
    }

    const locales = await SystemLocale.paginate({
      ...paginateOptions,
      where: { [Op.or]: { ownerId: userId, '$securables.action$': ['read', 'edit', 'delete'] } },
      ...securableScope(userId),
      subQuery: false,
    });

    res.json(locales);
  };

  const store = async (req: Request, res: Response<LocaleEntry>): Promise<void> => {
    const { userId } = req.scope.cradle;

    const input = pick(req.body, [
      'code',
      'englishName',
      'localName',
      'respondentLanguageId',
      'adminLanguageId',
      'countryFlagCode',
      'prototypeLocaleId',
      'textDirection',
      'foodIndexLanguageBackendId',
    ]);

    const { code, ...rest } = input;
    const foodsInput = { id: code, ...rest };

    const [locale] = await Promise.all([
      SystemLocale.create({ ...input, ownerId: userId }),
      FoodsLocale.create(foodsInput),
    ]);

    res.status(201).json(localeResponse(locale));
  };

  const read = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleEntry>
  ): Promise<void> => {
    const locale = await getAndCheckAccess(SystemLocale, 'read', req);

    res.json(localeResponse(locale));
  };

  const edit = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleEntry>
  ): Promise<void> => {
    const locale = await getAndCheckAccess(SystemLocale, 'edit', req);

    res.json(localeResponse(locale));
  };

  const update = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleEntry>
  ): Promise<void> => {
    const systemLocale = await getAndCheckAccess(SystemLocale, 'edit', req);
    const foodsLocale = await FoodsLocale.findByPk(systemLocale.code);
    if (!foodsLocale) throw new NotFoundError();

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

    res.json(localeResponse(systemLocale));
  };

  const destroy = async (
    req: Request<{ localeId: string }> /* , res: Response<undefined> */
  ): Promise<void> => {
    const systemLocale = await getAndCheckAccess(SystemLocale, 'delete', req, 'surveys');
    const foodsLocale = await FoodsLocale.findByPk(systemLocale.code);
    if (!systemLocale.surveys || !foodsLocale) throw new NotFoundError();

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

  const copy = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleEntry>
  ): Promise<void> => {
    await getAndCheckAccess(SystemLocale, 'copy', req);

    // TODO: implement locale copying
  };

  const uploadFoodRanking = async (
    req: Request<{ surveyId: string }>,
    res: Response<JobEntry>
  ): Promise<void> => {
    const { id, code } = await getAndCheckAccess(SystemLocale, 'food-ranking', req);

    const { file } = req;
    const { id: userId } = req.user as User;

    if (!file) throw new ValidationError('File not found.', { param: 'file' });

    // FIXME: change id field type to number in Locale model rather than parsing
    const job = await localeService.uploadFoodRanking(parseInt(id), code, userId, file);

    res.json(job);
  };

  const tasks = async (req: Request<{ localeId: string }>, res: Response<Job>): Promise<void> => {
    const {
      body: { job, params },
      params: { localeId },
    } = req;
    const { id: userId } = req.user as User;

    await getAndCheckAccess(SystemLocale, 'tasks', req);

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
    copy,
    uploadFoodRanking,
    tasks,
    securables: securableController({ ioc, securable: SystemLocale }),
  };
};

export default localeController;

export type LocaleController = ReturnType<typeof localeController>;
