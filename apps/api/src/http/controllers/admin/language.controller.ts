import type { Request, Response } from 'express';
import { pick } from 'lodash';
import type {
  LanguageEntry,
  LanguagesResponse,
  LanguageTranslationsResponse,
} from '@intake24/common/types/http/admin';
import { Language, PaginateQuery } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import type { Controller, CrudActions } from '../controller';

export type LanguageController = Controller<CrudActions | 'getTranslations' | 'updateTranslations'>;

export default ({ languageService }: Pick<IoC, 'languageService'>): LanguageController => {
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

  const getTranslations = async (
    req: Request<{ languageId: string }>,
    res: Response<LanguageTranslationsResponse>
  ): Promise<void> => {
    const { languageId } = req.params;

    const translations = await languageService.getLanguageTranslations(languageId);

    res.json(translations);
  };

  const updateTranslations = async (
    req: Request<{ languageId: string }>,
    res: Response<LanguageTranslationsResponse>
  ): Promise<void> => {
    const {
      body: { translations },
      params: { languageId },
    } = req;

    const translation = await languageService.updateLanguageTranslations(languageId, translations);

    res.json(translation);
  };

  return {
    browse,
    store,
    read,
    edit,
    update,
    destroy,
    refs,
    getTranslations,
    updateTranslations,
  };
};
