import type { Request, Response } from 'express';
import { Language, LanguageTranslation } from '@intake24/db';
import type { LocaleMessageObject } from '@intake24/i18n';
import { NotFoundError } from '@intake24/api/http/errors';
import type { I18nLanguageEntry, I18nLanguageListEntry } from '@intake24/common/types/http';
import type { Controller } from '../controller';

export type UserI18nController = Controller<'browse' | 'entry'>;

export default (): UserI18nController => {
  const browse = async (req: Request, res: Response<I18nLanguageListEntry[]>): Promise<void> => {
    const languages = await Language.scope('list').findAll();

    res.json(languages);
  };

  const entry = async (
    req: Request<{ languageId: string }, any, any, { app: string }>,
    res: Response<I18nLanguageEntry>
  ): Promise<void> => {
    const {
      params: { languageId },
      query: { app },
    } = req;

    const language = await Language.scope('public').findByPk(languageId, {
      include: [
        {
          model: LanguageTranslation,
          where: { application: app },
          required: false,
          separate: true,
        },
      ],
    });
    if (!language) throw new NotFoundError();

    const response = {
      ...language.get(),
      messages:
        language.translations?.reduce<LocaleMessageObject>((acc, { section, messages }) => {
          acc[section] = messages;
          return acc;
        }, {}) ?? {},
    };

    res.json(response);
  };

  return { browse, entry };
};
