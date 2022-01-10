import { Request, Response } from 'express';
import { Language, LanguageMessage } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
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

    const language = await Language.scope('public').findByPk(languageId, {
      include: [
        { model: LanguageMessage, where: { application: app }, required: false, separate: true },
      ],
    });
    if (!language) throw new NotFoundError();

    const response = {
      ...language.get(),
      messages:
        language.messages?.reduce<Record<string, string | object>>((acc, { section, messages }) => {
          acc[section] = messages;
          return acc;
        }, {}) ?? {},
    };

    res.json(response);
  };

  return { browse, entry };
};
