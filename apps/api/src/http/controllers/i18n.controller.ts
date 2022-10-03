import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { I18nLanguageEntry, I18nLanguageListEntry } from '@intake24/common/types/http';
import type { Includeable } from '@intake24/db';
import type { LocaleMessageObject } from '@intake24/i18n';
import { NotFoundError } from '@intake24/api/http/errors';
import { Language } from '@intake24/db';

const userI18nController = () => {
  const browse = async (req: Request, res: Response<I18nLanguageListEntry[]>): Promise<void> => {
    const languages = await Language.scope('public').findAll();

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

    const include: Includeable[] = [
      { association: 'translations', where: { application: [app, 'shared'] }, required: false },
    ];

    let language = await Language.scope('public').findOne({ where: { code: languageId }, include });

    if (!language && languageId.includes('-')) {
      const [fallback] = languageId.split('-');
      language = await Language.scope('public').findOne({ where: { code: fallback }, include });
    }

    if (!language) throw new NotFoundError();

    const response = {
      ...pick(language, [
        'id',
        'code',
        'englishName',
        'localName',
        'countryFlagCode',
        'textDirection',
      ]),
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

export default userI18nController;

export type UserI18nController = ReturnType<typeof userI18nController>;
