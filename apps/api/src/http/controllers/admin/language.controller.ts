import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { LanguageEntry, LanguagesResponse } from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { Language } from '@intake24/db';

const languageController = ({ languageService }: Pick<IoC, 'languageService'>) => {
  const entry = async (
    req: Request<{ languageId: string }>,
    res: Response<LanguageEntry>
  ): Promise<void> => {
    const { languageId } = req.params;

    const language = await languageService.getLanguage(languageId);

    res.json(language);
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<LanguagesResponse>
  ): Promise<void> => {
    const languages = await Language.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'englishName', 'localName'],
      order: [['id', 'ASC']],
    });

    res.json(languages);
  };

  const store = async (req: Request, res: Response<LanguageEntry>): Promise<void> => {
    const language = await languageService.createLanguage(
      pick(req.body, ['id', 'englishName', 'localName', 'countryFlagCode', 'textDirection'])
    );

    res.status(201).json(language);
  };

  const read = async (
    req: Request<{ languageId: string }>,
    res: Response<LanguageEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ languageId: string }>,
    res: Response<LanguageEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ languageId: string }>,
    res: Response<LanguageEntry>
  ): Promise<void> => {
    const { languageId } = req.params;

    const language = await languageService.updateLanguage(
      languageId,
      pick(req.body, ['englishName', 'localName', 'countryFlagCode', 'textDirection'])
    );

    res.json(language);
  };

  const destroy = async (
    req: Request<{ languageId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { languageId } = req.params;

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
  };
};

export default languageController;

export type LanguageController = ReturnType<typeof languageController>;
