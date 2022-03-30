import { pick } from 'lodash';
import type { Request, Response } from 'express';
import { Language, LanguageTranslation, FindOptions } from '@intake24/db';
import type { LocaleMessageObject } from '@intake24/i18n';
import { NotFoundError } from '@intake24/api/http/errors';
import type { I18nLanguageEntry, I18nLanguageListEntry } from '@intake24/common/types/http';
import type { Controller } from './controller';

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

    const options: FindOptions = {
      include: [
        { model: LanguageTranslation, where: { application: [app, 'shared'] }, required: false },
      ],
    };

    let language = await Language.scope('public').findByPk(languageId, options);

    if (!language && languageId.includes('-')) {
      const [fallback] = languageId.split('-');
      language = await Language.scope('public').findByPk(fallback, options);
    }

    if (!language) throw new NotFoundError();

    const response = {
      ...pick(language, ['id', 'englishName', 'localName', 'countryFlagCode', 'textDirection']),
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
