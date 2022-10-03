import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { LanguageEntry, LanguagesResponse } from '@intake24/common/types/http/admin';
import type { PaginateOptions, PaginateQuery } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { languageResponse } from '@intake24/api/http/responses/admin';
import { Language, Op, securableScope } from '@intake24/db';

import { getAndCheckAccess, securableController } from './securable.controller';

const languageController = (ioc: IoC) => {
  const { languageService } = ioc;

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<LanguagesResponse>
  ): Promise<void> => {
    const { aclService, userId } = req.scope.cradle;

    const paginateOptions: PaginateOptions = {
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'englishName', 'localName'],
      order: [['id', 'ASC']],
    };

    if (await aclService.hasPermission('languages|browse')) {
      const languages = await Language.paginate(paginateOptions);
      res.json(languages);
      return;
    }

    const languages = await Language.paginate({
      ...paginateOptions,
      where: { [Op.or]: { ownerId: userId, '$securables.action$': ['read', 'edit', 'delete'] } },
      ...securableScope(userId),
      subQuery: false,
    });

    res.json(languages);
  };

  const store = async (req: Request, res: Response<LanguageEntry>): Promise<void> => {
    const { userId } = req.scope.cradle;

    const language = await languageService.createLanguage({
      ...pick(req.body, ['code', 'englishName', 'localName', 'countryFlagCode', 'textDirection']),
      ownerId: userId,
    });

    res.status(201).json(languageResponse(language));
  };

  const read = async (
    req: Request<{ languageId: string }>,
    res: Response<LanguageEntry>
  ): Promise<void> => {
    const language = await getAndCheckAccess(Language, 'read', req);

    res.json(languageResponse(language));
  };

  const edit = async (
    req: Request<{ languageId: string }>,
    res: Response<LanguageEntry>
  ): Promise<void> => {
    const language = await getAndCheckAccess(Language, 'edit', req);

    res.json(languageResponse(language));
  };

  const update = async (
    req: Request<{ languageId: string }>,
    res: Response<LanguageEntry>
  ): Promise<void> => {
    const language = await getAndCheckAccess(Language, 'edit', req);

    await languageService.updateLanguage(
      language,
      pick(req.body, ['englishName', 'localName', 'countryFlagCode', 'textDirection'])
    );

    res.json(languageResponse(language));
  };

  const destroy = async (
    req: Request<{ languageId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { languageId } = req.params;

    await getAndCheckAccess(Language, 'delete', req);
    await languageService.deleteLanguage(languageId);

    res.status(204).json();
  };

  const refs = async (): Promise<void> => {
    throw new NotFoundError();
  };

  return {
    browse,
    store,
    read,
    edit,
    update,
    destroy,
    refs,
    securables: securableController({ ioc, securable: Language }),
  };
};

export default languageController;

export type LanguageController = ReturnType<typeof languageController>;
