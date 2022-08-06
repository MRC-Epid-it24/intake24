import type { IoC } from '@intake24/api/ioc';
import type { Application } from '@intake24/common/types';
import type {
  CreateLanguageRequest,
  LanguageEntry,
  UpdateLanguageRequest,
} from '@intake24/common/types/http/admin';
import type {
  LanguageTranslationAttributes,
  LanguageTranslationCreationAttributes,
} from '@intake24/common/types/models';
import type { WhereOptions } from '@intake24/db';
import { ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import { Language, LanguageTranslation } from '@intake24/db';
import { admin, compareMessageKeys, mergeTranslations, shared, survey } from '@intake24/i18n';

const languageService = ({ logger: globalLogger }: Pick<IoC, 'logger'>) => {
  const logger = globalLogger.child({ service: 'languageService' });

  /**
   * Get language record with messages
   *
   * @param {string} languageId
   * @returns {Promise<LanguageEntry>}
   */
  const getLanguage = async (languageId: string): Promise<LanguageEntry> => {
    const language = await Language.findByPk(languageId);
    if (!language) throw new NotFoundError();

    return language;
  };

  /**
   * Get language translations set
   *
   * @param {string} languageId
   * @returns {Promise<LanguageTranslation[]>}
   */
  const getLanguageTranslations = async (languageId: string): Promise<LanguageTranslation[]> =>
    LanguageTranslation.findAll({
      where: { languageId },
      order: [
        ['application', 'ASC'],
        ['section', 'ASC'],
      ],
    });

  /**
   * Initialize language translations set
   *
   * @param {string} languageId
   * @returns {Promise<void>}
   */
  const createLanguageTranslations = async (languageId: string): Promise<void> => {
    const adminLanguageTranslations: LanguageTranslationCreationAttributes[] = Object.keys(
      admin.en
    ).map((section) => ({
      languageId,
      application: 'admin',
      section,
      messages: admin.en[section],
    }));

    const surveyLanguageTranslations: LanguageTranslationCreationAttributes[] = Object.keys(
      survey.en
    ).map((section) => ({
      languageId,
      application: 'survey',
      section,
      messages: survey.en[section],
    }));

    const sharedLanguageTranslations: LanguageTranslationCreationAttributes[] = Object.keys(
      shared.en
    ).map((section) => ({
      languageId,
      application: 'shared',
      section,
      messages: shared.en[section],
    }));

    const languageMessages = [
      ...adminLanguageTranslations,
      ...surveyLanguageTranslations,
      ...sharedLanguageTranslations,
    ];

    if (languageMessages.length) await LanguageTranslation.bulkCreate(languageMessages);
  };

  /**
   * Get or initialize language translations set
   *
   * @param {string} languageId
   * @returns {Promise<LanguageTranslation[]>}
   */
  const getOrCreateLanguageTranslations = async (
    languageId: string
  ): Promise<LanguageTranslation[]> => {
    const translations = await getLanguageTranslations(languageId);
    if (translations.length) return translations;

    await createLanguageTranslations(languageId);

    return getLanguageTranslations(languageId);
  };

  /**
   * Create language with messages
   *
   * @param {CreateLanguageRequest} input
   * @returns {Promise<LanguageEntry>}
   */
  const createLanguage = async (input: CreateLanguageRequest): Promise<LanguageEntry> => {
    const language = await Language.create(input);
    await createLanguageTranslations(language.id);

    return language;
  };

  /**
   * Update language
   *
   * @param {string} languageId
   * @param {UpdateLanguageRequest} input
   * @returns {Promise<LanguageEntry>}
   */
  const updateLanguage = async (
    languageId: string,
    input: UpdateLanguageRequest
  ): Promise<LanguageEntry> => {
    const language = await Language.findByPk(languageId);
    if (!language) throw new NotFoundError();

    await language.update(input);

    return language;
  };

  /**
   * Delete language
   *
   * @param {string} languageId
   * @returns {Promise<void>}
   */
  const deleteLanguage = async (languageId: string): Promise<void> => {
    const language = await Language.scope(['adminLocales', 'surveyLocales']).findByPk(languageId);
    if (!language || !language.adminLocales || !language.surveyLocales) throw new NotFoundError();

    if (language.adminLocales.length || language.surveyLocales.length)
      throw new ForbiddenError(
        'Language cannot be deleted. There are locales using this language.'
      );

    await language.destroy();
  };

  /**
   * Update language translations set
   *
   * @param {string} languageId
   * @param {(Pick<LanguageTranslationAttributes, 'id' | 'messages'>[])} inputs
   * @returns {Promise<LanguageTranslation[]>}
   */
  const updateLanguageTranslations = async (
    languageId: string,
    inputs: Pick<LanguageTranslationAttributes, 'id' | 'messages'>[]
  ): Promise<LanguageTranslation[]> => {
    const language = await Language.findByPk(languageId, {
      include: [
        {
          model: LanguageTranslation,
          order: [
            ['application', 'ASC'],
            ['section', 'ASC'],
          ],
          separate: true,
        },
      ],
    });
    if (!language) throw new NotFoundError();

    const { translations } = language;

    if (!translations?.length) return [];

    for (const translation of translations) {
      const match = inputs.find((input) => input.id === translation.id);
      if (!match) continue;

      const { messages } = match;

      await translation.update({ messages });
    }

    return translations;
  };

  /**
   * Delete language translations set
   *
   * @param {string} languageId
   * @returns {Promise<number>}
   */
  const deleteLanguageTranslations = async (languageId: string): Promise<number> =>
    LanguageTranslation.destroy({ where: { languageId } });

  /**
   * Synchronize language translations
   * - inserts missing sections
   * - merges current translations with default ones
   *
   * @param {(string | string[])} [id]
   * @returns {Promise<void>}
   */
  const syncLanguageTranslations = async (id?: string | string[]): Promise<void> => {
    const where: WhereOptions<LanguageTranslationAttributes> = {};
    if (id) where.id = id;

    const languages = await Language.findAll({ where, include: [{ model: LanguageTranslation }] });
    if (!languages.length) return;

    for (const language of languages) {
      if (!language.translations) throw new NotFoundError();

      const { id: languageId, translations } = language;

      if (!translations.length) {
        await createLanguageTranslations(languageId);
        continue;
      }

      const inserts: LanguageTranslationCreationAttributes[] = [];
      const promises: PromiseLike<any>[] = [];

      const defaultAppMessages = { admin, survey, shared };

      for (const [app, appMessages] of Object.entries(defaultAppMessages)) {
        const application = app as Application;

        for (const [section, messages] of Object.entries(appMessages.en)) {
          const translation = translations.find(
            (item) => item.application === application && item.section === section
          );

          if (!translation) {
            inserts.push({ languageId, application, section, messages });

            logger.debug(`Creating language messages for '${application}:${section}'.`);
            continue;
          }

          if (compareMessageKeys(messages, translation.messages)) continue;

          promises.push(
            translation.update({ messages: mergeTranslations(messages, translation.messages) })
          );
          logger.debug(`Updating language messages for '${application}:${section}'.`);
        }
      }

      if (inserts.length) promises.push(LanguageTranslation.bulkCreate(inserts));

      if (promises.length) await Promise.all(promises);
    }
  };

  return {
    getLanguage,
    createLanguage,
    updateLanguage,
    deleteLanguage,
    createLanguageTranslations,
    getLanguageTranslations,
    getOrCreateLanguageTranslations,
    updateLanguageTranslations,
    deleteLanguageTranslations,
    syncLanguageTranslations,
  };
};

export default languageService;

export type LanguageService = ReturnType<typeof languageService>;
