import { Request, Response, NextFunction } from 'express';
import { pick } from 'lodash';
import { Language } from '@/db/models/system';
import { ForbiddenError, NotFoundError } from '@/http/errors';
import {
  CreateLanguageResponse,
  LanguageResponse,
  LanguagesResponse,
  StoreLanguageResponse,
} from '@common/types/http/admin/languages';

const entry = async (
  req: Request,
  res: Response<LanguageResponse>,
  next: NextFunction
): Promise<void> => {
  const { languageId } = req.params;
  const language = await Language.findByPk(languageId);

  if (!language) {
    next(new NotFoundError());
    return;
  }

  res.json({ data: language, refs: {} });
};

export default {
  async list(req: Request, res: Response<LanguagesResponse>): Promise<void> {
    const languages = await Language.paginate({
      req,
      columns: ['id', 'englishName', 'localName'],
    });

    res.json(languages);
  },

  async create(req: Request, res: Response<CreateLanguageResponse>): Promise<void> {
    res.json({ refs: {} });
  },

  async store(req: Request, res: Response<StoreLanguageResponse>): Promise<void> {
    const scheme = await Language.create(
      pick(req.body, ['id', 'englishName', 'localName', 'countryFlagCode', 'textDirection'])
    );

    res.status(201).json({ data: scheme });
  },

  async detail(req: Request, res: Response<LanguageResponse>, next: NextFunction): Promise<void> {
    entry(req, res, next);
  },

  async edit(req: Request, res: Response<LanguageResponse>, next: NextFunction): Promise<void> {
    entry(req, res, next);
  },

  async update(req: Request, res: Response<LanguageResponse>, next: NextFunction): Promise<void> {
    const { languageId } = req.params;
    const language = await Language.findByPk(languageId);

    if (!language) {
      next(new NotFoundError());
      return;
    }

    await language.update(
      pick(req.body, ['englishName', 'localName', 'countryFlagCode', 'textDirection'])
    );

    res.json({ data: language, refs: {} });
  },

  async delete(req: Request, res: Response<undefined>, next: NextFunction): Promise<void> {
    const { languageId } = req.params;
    const language = await Language.scope(['adminLocales', 'surveyLocales']).findByPk(languageId);

    if (!language) {
      next(new NotFoundError());
      return;
    }

    if (language.adminLocales?.length || language.surveyLocales?.length) {
      next(
        new ForbiddenError('Language cannot be deleted. There are locales using this language.')
      );
      return;
    }

    await language.destroy();
    res.status(204).json();
  },
};
