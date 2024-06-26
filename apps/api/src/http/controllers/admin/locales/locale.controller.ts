import type { Request, Response } from 'express';
import { pick } from 'lodash';
import { col, fn } from 'sequelize';

import type { IoC } from '@intake24/api/ioc';
import type { LocaleEntry, LocaleRefs, LocalesResponse } from '@intake24/common/types/http/admin';
import type { Job, PaginateOptions, PaginateQuery } from '@intake24/db';
import languageBackends from '@intake24/api/food-index/language-backends';
import { ForbiddenError, NotFoundError, ValidationError } from '@intake24/api/http/errors';
import { localeResponse } from '@intake24/api/http/responses/admin';
import { jobRequiresFile, pickJobParams } from '@intake24/common/types';
import { FoodsLocale, Op, securableScope, SystemLocale } from '@intake24/db';

function localeController(ioc: IoC) {
  const { cache, localeService } = ioc;

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<LocalesResponse>,
  ): Promise<void> => {
    const {
      aclService,
      user: { userId },
    } = req.scope.cradle;

    const paginateOptions: PaginateOptions = {
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['code', 'englishName', 'localName'],
      order: [[fn('lower', col('Locale.code')), 'ASC']],
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
    const { userId } = req.scope.cradle.user;

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
      'foodIndexEnabled',
      'visibility',
    ]);

    const { code, ...rest } = input;
    const foodsInput = { id: code, ...rest };

    const [locale] = await Promise.all([
      SystemLocale.create({ ...input, ownerId: userId }),
      FoodsLocale.create(foodsInput),
    ]);

    if (input.foodIndexEnabled)
      await cache.push('indexing-locales', locale.id);

    res.status(201).json(localeResponse(locale));
  };

  const read = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleEntry>,
  ): Promise<void> => {
    const { localeId } = req.params;
    const { aclService } = req.scope.cradle;

    const locale = await aclService.findAndCheckRecordAccess(SystemLocale, 'read', {
      where: { id: localeId },
      include: [
        { association: 'parent' },
        { association: 'adminLanguage' },
        { association: 'respondentLanguage' },
      ],
    });

    res.json(localeResponse(locale));
  };

  const getByCode = async (
    req: Request<{ code: string }>,
    res: Response<LocaleEntry>,
  ): Promise<void> => {
    const { aclService } = req.scope.cradle;

    const locale = await aclService.findAndCheckRecordAccess(SystemLocale, 'read', {
      where: { code: req.params.code },
    });

    res.json(localeResponse(locale));
  };

  const edit = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleEntry>,
  ): Promise<void> => {
    const { localeId } = req.params;
    const { aclService } = req.scope.cradle;

    const locale = await aclService.findAndCheckRecordAccess(SystemLocale, 'edit', {
      where: { id: localeId },
      include: [
        { association: 'parent' },
        { association: 'adminLanguage' },
        { association: 'respondentLanguage' },
      ],
    });

    res.json(localeResponse(locale));
  };

  const update = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleEntry>,
  ): Promise<void> => {
    const { localeId } = req.params;
    const { aclService } = req.scope.cradle;

    const systemLocale = await aclService.findAndCheckRecordAccess(SystemLocale, 'edit', {
      where: { id: localeId },
      include: [
        { association: 'parent' },
        { association: 'adminLanguage' },
        { association: 'respondentLanguage' },
      ],
    });
    const foodsLocale = await FoodsLocale.findByPk(systemLocale.code);
    if (!foodsLocale)
      throw new NotFoundError();

    const input = pick(req.body, [
      'englishName',
      'localName',
      'respondentLanguageId',
      'adminLanguageId',
      'countryFlagCode',
      'prototypeLocaleId',
      'textDirection',
      'foodIndexLanguageBackendId',
      'foodIndexEnabled',
      'visibility',
    ]);

    if (req.body.foodIndexEnabled && !systemLocale.foodIndexEnabled)
      await cache.push('indexing-locales', localeId);

    await Promise.all([systemLocale.update(input), foodsLocale.update(input)]);

    await systemLocale.reload();

    res.json(localeResponse(systemLocale));
  };

  const destroy = async (
    req: Request<{ localeId: string }>, /* , res: Response<undefined> */
  ): Promise<void> => {
    const { localeId } = req.params;
    const { aclService } = req.scope.cradle;

    const systemLocale = await aclService.findAndCheckRecordAccess(SystemLocale, 'delete', {
      attributes: ['id', 'code'],
      where: { id: localeId },
      include: [{ association: 'surveys', attributes: ['id'] }],
    });
    const foodsLocale = await FoodsLocale.findByPk(systemLocale.code);
    if (!systemLocale.surveys || !foodsLocale)
      throw new NotFoundError();

    if (systemLocale.surveys.length)
      throw new ForbiddenError('Locale cannot be deleted. There are surveys using this locale.');

    // TODO: implement locale deletion -> check what needs to be deleted in food DB
    // Food DB locale record + all local food records
    throw new ForbiddenError('Locale cannot be deleted.');

    // await Promise.all([systemLocale.destroy(), foodsLocale.destroy()]);
    // res.status(204).json();
  };

  const refs = async (req: Request, res: Response<LocaleRefs>): Promise<void> => {
    const foodIndexLanguageBackends = Object.entries(languageBackends).map(([id, { name }]) => ({
      id,
      name,
    }));

    const locales = await SystemLocale.scope('list').findAll();

    res.json({ locales, foodIndexLanguageBackends });
  };

  const tasks = async (req: Request<{ localeId: string }>, res: Response<Job>): Promise<void> => {
    const {
      body: { type },
      file,
      params: { localeId },
    } = req;
    const {
      aclService,
      user: { userId },
    } = req.scope.cradle;

    await aclService.findAndCheckRecordAccess(SystemLocale, 'tasks', {
      attributes: ['id'],
      where: { id: localeId },
    });

    const params = { ...pickJobParams(req.body.params, type), localeId };
    if (jobRequiresFile(type)) {
      if (!file)
        throw new ValidationError('Missing file.', { path: 'params.file' });

      params.file = file.path;
    }

    const job = await localeService.queueTask({ userId, type, params });

    // TODO: implement locale copying as a job

    res.json(job);
  };

  return {
    browse,
    store,
    read,
    getByCode,
    edit,
    update,
    destroy,
    refs,
    tasks,
  };
}

export default localeController;

export type LocaleController = ReturnType<typeof localeController>;
