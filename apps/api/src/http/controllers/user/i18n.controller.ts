import { Request, Response } from 'express';
import { Language } from '@intake24/db';
import { admin, survey } from '@intake24/i18n';
import { NotFoundError } from '@api/http/errors';
import { Controller } from '../controller';

export type UserI18nController = Controller<'browse' | 'entry'>;

export default (): UserI18nController => {
  const browse = async (req: Request, res: Response): Promise<void> => {
    const languages = await Language.scope('list').findAll();

    res.json(languages);
  };

  const entry = async (
    req: Request<{ languageId: string }, any, any, { app: string }>,
    res: Response
  ): Promise<void> => {
    const {
      params: { languageId },
      query: { app },
    } = req;

    const language = await Language.findByPk(languageId);
    if (!language) throw new NotFoundError();

    res.json({ ...language.get(), messages: admin[languageId] });
  };

  return { browse, entry };
};
