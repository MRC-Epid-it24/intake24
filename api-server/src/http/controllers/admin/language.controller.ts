import { Request, Response } from 'express';
import { pick } from 'lodash';
import {
  CreateLanguageResponse,
  LanguageResponse,
  LanguagesResponse,
  StoreLanguageResponse,
} from '@common/types/http/admin';
import { Language } from '@/db/models/system';
import { ForbiddenError, NotFoundError } from '@/http/errors';
import { Controller, CrudActions } from '../controller';

export type LanguageController = Controller<CrudActions>;

export default (): LanguageController => {
  const entry = async (req: Request, res: Response<LanguageResponse>): Promise<void> => {
    const { languageId } = req.params;
    const language = await Language.findByPk(languageId);

    if (!language) throw new NotFoundError();

    res.json({ data: language, refs: {} });
  };

  const browse = async (req: Request, res: Response<LanguagesResponse>): Promise<void> => {
    const languages = await Language.paginate({
      req,
      columns: ['id', 'englishName', 'localName'],
      order: [['id', 'ASC']],
    });

    res.json(languages);
  };

  const create = async (req: Request, res: Response<CreateLanguageResponse>): Promise<void> => {
    res.json({ refs: {} });
  };

  const store = async (req: Request, res: Response<StoreLanguageResponse>): Promise<void> => {
    const scheme = await Language.create(
      pick(req.body, ['id', 'englishName', 'localName', 'countryFlagCode', 'textDirection'])
    );

    res.status(201).json({ data: scheme });
  };

  const read = async (req: Request, res: Response<LanguageResponse>): Promise<void> =>
    entry(req, res);

  const edit = async (req: Request, res: Response<LanguageResponse>): Promise<void> =>
    entry(req, res);

  const update = async (req: Request, res: Response<LanguageResponse>): Promise<void> => {
    const { languageId } = req.params;
    const language = await Language.findByPk(languageId);

    if (!language) throw new NotFoundError();

    await language.update(
      pick(req.body, ['englishName', 'localName', 'countryFlagCode', 'textDirection'])
    );

    res.json({ data: language, refs: {} });
  };

  const destroy = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { languageId } = req.params;
    const language = await Language.scope(['adminLocales', 'surveyLocales']).findByPk(languageId);

    if (!language) throw new NotFoundError();

    if (language.adminLocales?.length || language.surveyLocales?.length)
      throw new ForbiddenError(
        'Language cannot be deleted. There are locales using this language.'
      );

    await language.destroy();
    res.status(204).json();
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
