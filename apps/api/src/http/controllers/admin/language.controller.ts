import { Request, Response } from 'express';
import { pick } from 'lodash';
import { LanguageEntry, LanguagesResponse } from '@common/types/http/admin';
import { Language } from '@api/db/models/system';
import { ForbiddenError, NotFoundError } from '@api/http/errors';
import { PaginateQuery } from '@api/db/models/model';
import { Controller, CrudActions } from '../controller';

export type LanguageController = Controller<Exclude<CrudActions, 'refs'>>;

export default (): LanguageController => {
  const entry = async (req: Request, res: Response<LanguageEntry>): Promise<void> => {
    const { languageId } = req.params;

    const language = await Language.findByPk(languageId);
    if (!language) throw new NotFoundError();

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
    const scheme = await Language.create(
      pick(req.body, ['id', 'englishName', 'localName', 'countryFlagCode', 'textDirection'])
    );

    res.status(201).json(scheme);
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

    const language = await Language.findByPk(languageId);
    if (!language) throw new NotFoundError();

    await language.update(
      pick(req.body, ['englishName', 'localName', 'countryFlagCode', 'textDirection'])
    );

    res.json(language);
  };

  const destroy = async (
    req: Request<{ languageId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
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
    store,
    read,
    edit,
    update,
    destroy,
  };
};
