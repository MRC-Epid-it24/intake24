import type { Transaction } from 'sequelize';

import type { IoC } from '@intake24/api/ioc';
import type { QueueJob } from '@intake24/common/types';
import type {
  CreateRespondentInput,
  UpdateRespondentInput,
} from '@intake24/common/types/http/admin';
import type { Job, UserCustomFieldCreationAttributes } from '@intake24/db';
import { ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import { toSimpleName } from '@intake24/api/util';
import { surveyRespondent } from '@intake24/common/security';
import { randomString } from '@intake24/common/util';
import {
  Op,
  Permission,
  PermissionUser,
  Survey,
  User,
  UserCustomField,
  UserSurveyAlias,
} from '@intake24/db';

function adminSurveyService({
  adminUserService,
  db,
  securityConfig,
  scheduler,
}: Pick<IoC, 'adminUserService' | 'db' | 'securityConfig' | 'scheduler'>) {
  /**
   * Fetch survey-specific respondent permission instance or create one
   *
   * @param {string} slug
   * @returns {Promise<Permission>}
   */
  const getSurveyRespondentPermission = async (slug: string, options: { transaction?: Transaction } = {}): Promise<Permission> => {
    const name = surveyRespondent(slug);
    const [permission] = await Permission.findOrCreate({
      where: { name },
      defaults: { name, displayName: name },
      transaction: options.transaction,
    });

    return permission;
  };

  /**
   * Get survey resource permissions
   *
   * @param {(string | string[])} [scope]
   * @returns {Promise<Permission[]>}
   */
  const getSurveyResourcePermissions = async (
    scope: string | string[] = [],
  ): Promise<Permission[]> =>
    Permission.scope(scope).findAll({
      where: { name: { [Op.startsWith]: 'surveys-' } },
      order: [['name', 'ASC']],
    });

  /**
   * Create respondent record
   *
   * @param {(Survey | string)} survey
   * @param {CreateRespondentInput} input
   * @returns {Promise<UserSurveyAlias>}
   */
  const createRespondent = async (
    survey: Survey | string,
    input: CreateRespondentInput,
  ): Promise<UserSurveyAlias> => {
    const surveyEntry
      = typeof survey === 'string'
        ? await Survey.findByPk(survey, {
          attributes: [
            'id',
            'slug',
            'authUrlTokenCharset',
            'authUrlTokenLength',
            'userCustomFields',
            'userPersonalIdentifiers',
          ],
        })
        : survey;
    if (!surveyEntry)
      throw new NotFoundError();

    const {
      id: surveyId,
      slug,
      authUrlTokenCharset,
      authUrlTokenLength,
      userCustomFields,
      userPersonalIdentifiers,
    } = surveyEntry;
    const { name, email, phone, customFields, password, username } = input;

    return db.system.transaction(async (transaction) => {
      const surveyRespondentPermission = await getSurveyRespondentPermission(slug, { transaction });
      const user = await User.create(
        userPersonalIdentifiers ? { name, email, phone, simpleName: toSimpleName(name) } : {},
        { transaction },
      );

      const { id: userId } = user;
      const { size, alphabet } = securityConfig.authTokens;

      const [respondent] = await Promise.all(
        [
          UserSurveyAlias.create(
            {
              userId,
              surveyId,
              username,
              urlAuthToken: randomString(
                authUrlTokenLength ?? size,
                authUrlTokenCharset ?? alphabet,
              ),
            },
            { transaction },
          ),
          user.$add('permissions', surveyRespondentPermission, { transaction }),
          adminUserService.createPassword({ userId, password }, transaction),
          userCustomFields && customFields?.length
            ? UserCustomField.bulkCreate(
              customFields.map(field => ({ ...field, userId })),
              { transaction },
            )
            : null,
        ].filter(Boolean),
      );

      return respondent as UserSurveyAlias;
    });
  };

  /**
   * Bulk create survey respondents
   *
   * @param {string} surveyId
   * @param {CreateRespondentInput[]} inputs
   * @returns {Promise<void>}
   */
  const createRespondents = async (
    surveyId: string,
    inputs: CreateRespondentInput[],
  ): Promise<UserSurveyAlias[]> => {
    const survey = await Survey.findByPk(surveyId, {
      attributes: [
        'id',
        'slug',
        'userCustomFields',
        'userPersonalIdentifiers',
        'authUrlTokenCharset',
        'authUrlTokenLength',
      ],
    });
    if (!survey)
      throw new NotFoundError();

    const { size, alphabet } = securityConfig.authTokens;

    const { userCustomFields, userPersonalIdentifiers } = survey;

    const urlTokenCharset = survey.authUrlTokenCharset ?? alphabet;
    const urlTokenLength = survey.authUrlTokenLength ?? size;

    return db.system.transaction(async (transaction) => {
      const { id: permissionId } = await getSurveyRespondentPermission(survey.slug, { transaction });

      const aliasRecords = [];
      const customFieldsRecords: UserCustomFieldCreationAttributes[] = [];
      const passwordRecords = [];
      const permissionRecords = [];

      for (const input of inputs) {
        const { name, email, phone, customFields, password, username } = input;
        // User records are created one-by-one
        // This is to keep it MySQL+others-like compatible, where bulk operation doesn't return generated IDs
        const { id: userId } = await User.create(
          userPersonalIdentifiers ? { name, email, phone, simpleName: toSimpleName(name) } : {},
          { transaction },
        );

        if (userCustomFields && customFields?.length) {
          customFields.forEach((field) => {
            customFieldsRecords.push({ ...field, userId });
          });
        }

        aliasRecords.push({
          userId,
          surveyId,
          username,
          urlAuthToken: randomString(urlTokenLength, urlTokenCharset),
        });
        passwordRecords.push({ userId, password });
        permissionRecords.push({ userId, permissionId });
      }

      const [aliases] = await Promise.all([
        UserSurveyAlias.bulkCreate(aliasRecords, { transaction }),
        adminUserService.createPasswords(passwordRecords, transaction),
        PermissionUser.bulkCreate(permissionRecords, { transaction }),
        UserCustomField.bulkCreate(customFieldsRecords, { transaction }),
      ]);

      return aliases;
    });
  };

  /**
   * Update respondent record
   *
   * @param {string} surveyId
   * @param {string} username
   * @param {UpdateRespondentInput} input
   * @returns {Promise<UserSurveyAlias>}
   */
  const updateRespondent = async (
    surveyId: string,
    username: string,
    input: UpdateRespondentInput,
  ): Promise<UserSurveyAlias> => {
    const [survey, alias] = await Promise.all([
      Survey.findByPk(surveyId, {
        attributes: ['id', 'userCustomFields', 'userPersonalIdentifiers'],
      }),
      UserSurveyAlias.findOne({
        where: { surveyId, username },
        include: [
          { association: 'user', required: true, include: [{ association: 'customFields' }] },
        ],
      }),
    ]);

    if (!survey || !alias?.user)
      throw new NotFoundError();

    const { user, userId } = alias;

    await db.system.transaction(async (transaction) => {
      const { userCustomFields, userPersonalIdentifiers } = survey;
      const { name, email, phone, customFields, password } = input;

      await Promise.all(
        [
          userPersonalIdentifiers
            ? user.update({ name, email, phone, simpleName: toSimpleName(name) }, { transaction })
            : null,
          password ? adminUserService.updatePassword(userId, password, transaction) : null,
          userCustomFields && customFields && user.customFields
            ? adminUserService.updateUserCustomFields(
              userId,
              user.customFields,
              customFields,
              transaction,
            )
            : null,
          adminUserService.flushACLCacheByUserId(userId),
        ].filter(Boolean),
      );
    });

    return alias;
  };

  /**
   * Delete respondent record
   *
   * @param {string} surveyId
   * @param {string} username
   * @returns {Promise<void>}
   */
  const deleteRespondent = async (surveyId: string, username: string): Promise<void> => {
    const [survey, alias] = await Promise.all([
      Survey.findByPk(surveyId, { attributes: ['id', 'slug'] }),
      UserSurveyAlias.findOne({
        where: { surveyId, username },
        include: [
          {
            association: 'user',
            attributes: ['id', 'email'],
            required: true,
            include: [{ association: 'submissions', attributes: ['id'] }],
          },
        ],
      }),
    ]);

    if (!survey || !alias?.user)
      throw new NotFoundError();

    const { user, userId } = alias;

    if (!user.submissions || user.submissions.length)
      throw new ForbiddenError('User cannot be deleted. It already contains submission data.');

    // System-wide account - delete only access to study
    if (user.email) {
      await db.system.transaction(async (transaction) => {
        await Promise.all([
          UserSurveyAlias.destroy({ where: { surveyId, userId }, transaction }),
          user.$remove('permissions', await getSurveyRespondentPermission(survey.slug), {
            transaction,
          }),
        ]);
      });
    }
    else {
      // Wipe the whole user record
      await user.destroy();
    }
  };

  /**
   * Bulk import of survey respondents
   * - runs as a job
   * - temporarily stores CSV file
   *
   * @param {string} surveyId
   * @param {string} userId
   * @param {Express.Multer.File} file
   * @returns {Promise<Job>}
   */
  const importRespondents = async (
    surveyId: string,
    userId: string,
    file: Express.Multer.File,
  ): Promise<Job> => {
    const survey = await Survey.findByPk(surveyId, { attributes: ['id'] });
    if (!survey)
      throw new NotFoundError();

    return scheduler.jobs.addJob({
      type: 'SurveyRespondentsImport',
      userId,
      params: { surveyId, file: file.path },
    });
  };

  /**
   * Export survey respondents authentication URLs
   * - runs as a job and creates downloadable file
   *
   * @param {string} surveyId
   * @param {string} userId
   * @returns {Promise<Job>}
   */
  const exportAuthenticationUrls = async (surveyId: string, userId: string): Promise<Job> => {
    const survey = await Survey.findByPk(surveyId, { attributes: ['id'] });
    if (!survey)
      throw new NotFoundError();

    return scheduler.jobs.addJob({
      type: 'SurveyAuthUrlsExport',
      userId,
      params: { surveyId },
    });
  };

  /**
   * Queue locale tasks
   *
   * @param {QueueJob} input
   * @returns
   */
  const queueTask = async (input: QueueJob) => scheduler.jobs.addJob(input);

  return {
    getSurveyRespondentPermission,
    getSurveyResourcePermissions,
    createRespondent,
    createRespondents,
    updateRespondent,
    deleteRespondent,
    importRespondents,
    exportAuthenticationUrls,
    queueTask,
  };
}

export default adminSurveyService;

export type AdminSurveyService = ReturnType<typeof adminSurveyService>;
