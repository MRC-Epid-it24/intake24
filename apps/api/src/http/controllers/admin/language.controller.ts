import { Request, Response } from 'express';
import { pick } from 'lodash';
import { LanguageEntry, LanguagesResponse } from '@intake24/common/types/http/admin';
import { Language, LanguageMessage, PaginateQuery } from '@intake24/db';
import { admin, survey, LocaleMessages } from '@intake24/i18n';
import { ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import { LanguageMessageCreationAttributes } from '@intake24/common/types/models';
import { Controller, CrudActions } from '../controller';

export type LanguageController = Controller<CrudActions | 'initializeMessages'>;

export default (): LanguageController => {
  const entry = async (req: Request, res: Response<LanguageEntry>): Promise<void> => {
    const { languageId } = req.params;

    const language = await Language.findByPk(languageId, {
      include: [
        {
          model: LanguageMessage,
          order: [
            ['application', 'ASC'],
            ['section', 'ASC'],
          ],
          separate: true,
        },
      ],
    });
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
    const language = await Language.create(
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
    if (!language || !language.adminLocales || !language.surveyLocales) throw new NotFoundError();

    if (language.adminLocales.length || language.surveyLocales.length)
      throw new ForbiddenError(
        'Language cannot be deleted. There are locales using this language.'
      );

    await language.destroy();
    res.status(204).json();
  };

  const refs = async (): Promise<void> => {
    throw new NotFoundError();
  };

  const initializeMessages = async (
    req: Request<{ languageId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { languageId } = req.params;

    const language = await Language.findByPk(languageId, { include: [{ model: LanguageMessage }] });
    if (!language || !language.messages) throw new NotFoundError();

    const { messages } = language;

    const adminSections = messages
      .filter((message) => message.application === 'admin')
      .map(({ section }) => section);
    const surveySections = messages
      .filter((message) => message.application === 'survey')
      .map(({ section }) => section);

    const adminLanguageMessages: LanguageMessageCreationAttributes[] = Object.keys(admin.en)
      .filter((section) => !adminSections.includes(section))
      .map((section) => ({
        languageId: language.id,
        application: 'admin',
        section,
        messages: admin.en[section] as LocaleMessages,
      }));

    const surveyLanguageMessages: LanguageMessageCreationAttributes[] = Object.keys(survey.en)
      .filter((section) => !surveySections.includes(section))
      .map((section) => ({
        languageId: language.id,
        application: 'survey',
        section,
        messages: survey.en[section] as LocaleMessages,
      }));

    const languageMessages = [...adminLanguageMessages, ...surveyLanguageMessages];

    if (languageMessages.length) await LanguageMessage.bulkCreate(languageMessages);

    res.json();
  };

  return {
    browse,
    store,
    read,
    edit,
    update,
    destroy,
    refs,
    initializeMessages,
  };
};
