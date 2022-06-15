import type { Job } from '@intake24/db';
import {
  Op,
  Permission,
  PermissionUser,
  Survey,
  User,
  UserCustomField,
  UserSurveyAlias,
} from '@intake24/db';
import type {
  CreateRespondentInput,
  UpdateRespondentInput,
} from '@intake24/common/types/http/admin';
import type { UserCustomFieldAttributes } from '@intake24/common/types/models';
import { ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import { toSimpleName } from '@intake24/api/util';
import { randomString } from '@intake24/common/util';
import { surveyRespondent } from '@intake24/common/security';

const adminSurveyService = ({
  adminUserService,
  securityConfig,
  scheduler,
}: Pick<IoC, 'adminUserService' | 'securityConfig' | 'scheduler'>) => {
  /**
   * Fetch survey-specific respondent permission instance or create one
   *
   * @param {string} slug
   * @returns {Promise<Permission>}
   */
  const getSurveyRespondentPermission = async (slug: string): Promise<Permission> => {
    const name = surveyRespondent(slug);
    const [permission] = await Permission.findOrCreate({
      where: { name },
      defaults: { name, displayName: name },
    });

    return permission;
  };

  /**
   * Get survey resource permissions
   *
   * @param {(string | string[])} [scope=[]]
   * @returns {Promise<Permission[]>}
   */
  const getSurveyResourcePermissions = async (
    scope: string | string[] = []
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
    input: CreateRespondentInput
  ): Promise<UserSurveyAlias> => {
    const surveyEntry = typeof survey === 'string' ? await Survey.findByPk(survey) : survey;
    if (!surveyEntry) throw new NotFoundError();

    const {
      id: surveyId,
      slug,
      authUrlTokenCharset,
      authUrlTokenLength,
      userCustomFields,
      userPersonalIdentifiers,
    } = surveyEntry;
    const { name, email, phone, customFields, password, username } = input;

    const user = await User.create(
      userPersonalIdentifiers ? { name, email, phone, simpleName: toSimpleName(name) } : {}
    );

    const { id: userId } = user;
    const { size, alphabet } = securityConfig.authTokens;

    const surveyRespondentPermission = await getSurveyRespondentPermission(slug);

    const [respondent] = await Promise.all(
      [
        UserSurveyAlias.create({
          userId,
          surveyId,
          username,
          urlAuthToken: randomString(authUrlTokenLength ?? size, authUrlTokenCharset ?? alphabet),
        }),
        user.$add('permissions', surveyRespondentPermission),
        adminUserService.createPassword({ userId, password }),
        userCustomFields && customFields?.length
          ? UserCustomField.bulkCreate(customFields.map((field) => ({ ...field, userId })))
          : null,
      ].filter(Boolean)
    );

    return respondent as UserSurveyAlias;
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
    inputs: CreateRespondentInput[]
  ): Promise<UserSurveyAlias[]> => {
    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    const { id: permissionId } = await getSurveyRespondentPermission(survey.slug);
    const { size, alphabet } = securityConfig.authTokens;

    const { userCustomFields, userPersonalIdentifiers } = survey;

    const urlTokenCharset = survey.authUrlTokenCharset ?? alphabet;
    const urlTokenLength = survey.authUrlTokenLength ?? size;

    const aliasRecords = [];
    const customFieldsRecords: Omit<UserCustomFieldAttributes, 'id'>[] = [];
    const passwordRecords = [];
    const permissionRecords = [];

    for (const input of inputs) {
      const { name, email, phone, customFields, password, username } = input;
      // User records are created one-by-one
      // This is to keep it MySQL+others-like compatible, where bulk operation doesn't return generated IDs
      const { id: userId } = await User.create(
        userPersonalIdentifiers ? { name, email, phone, simpleName: toSimpleName(name) } : {}
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
      UserSurveyAlias.bulkCreate(aliasRecords),
      adminUserService.createPasswords(passwordRecords),
      PermissionUser.bulkCreate(permissionRecords),
      UserCustomField.bulkCreate(customFieldsRecords),
    ]);

    return aliases;
  };

  /**
   * Update respondent record
   *
   * @param {string} surveyId
   * @param {string} userId
   * @param {UpdateRespondentInput} input
   * @returns {Promise<UserSurveyAlias>}
   */
  const updateRespondent = async (
    surveyId: string,
    userId: string,
    input: UpdateRespondentInput
  ): Promise<UserSurveyAlias> => {
    const [survey, user] = await Promise.all([
      Survey.findByPk(surveyId),
      User.scope('customFields').findOne({
        include: [{ model: UserSurveyAlias, where: { userId, surveyId } }],
      }),
    ]);

    if (!survey || !user?.aliases) throw new NotFoundError();

    const { userCustomFields, userPersonalIdentifiers } = survey;
    const { name, email, phone, customFields, password } = input;

    await Promise.all(
      [
        userPersonalIdentifiers
          ? user.update({ name, email, phone, simpleName: toSimpleName(name) })
          : null,
        password ? adminUserService.updatePassword(user.id, password) : null,
        userCustomFields && customFields && user.customFields
          ? adminUserService.updateUserCustomFields(userId, user.customFields, customFields)
          : null,
        adminUserService.flushUserACLCache(user.id),
      ].filter(Boolean)
    );

    return user.aliases[0];
  };

  /**
   * Delete respondent record
   *
   * @param {string} surveyId
   * @param {(string | number)} userId
   * @returns {Promise<void>}
   */
  const deleteRespondent = async (surveyId: string, userId: string | number): Promise<void> => {
    const [survey, user] = await Promise.all([
      Survey.findByPk(surveyId),
      User.scope('submissions').findOne({
        where: { id: userId },
        include: [{ model: UserSurveyAlias, where: { surveyId } }],
      }),
    ]);

    if (!survey || !user) throw new NotFoundError();

    if (!user.submissions || user.submissions.length)
      throw new ForbiddenError('User cannot be deleted. It already contains submission data.');

    // System-wide account - delete only access to study
    if (user.email) {
      await Promise.all([
        UserSurveyAlias.destroy({ where: { surveyId, userId } }),
        user.$remove('permissions', await getSurveyRespondentPermission(survey.slug)),
      ]);
    } else {
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
    file: Express.Multer.File
  ): Promise<Job> => {
    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    return scheduler.jobs.addJob(
      { type: 'SurveyImportRespondents', userId },
      { surveyId, file: file.path }
    );
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
    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    return scheduler.jobs.addJob({ type: 'SurveyExportRespondentAuthUrls', userId }, { surveyId });
  };

  return {
    getSurveyRespondentPermission,
    getSurveyResourcePermissions,
    createRespondent,
    createRespondents,
    updateRespondent,
    deleteRespondent,
    importRespondents,
    exportAuthenticationUrls,
  };
};

export default adminSurveyService;

export type AdminSurveyService = ReturnType<typeof adminSurveyService>;
