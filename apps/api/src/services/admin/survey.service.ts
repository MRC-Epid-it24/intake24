import {
  Op,
  Job,
  Permission,
  PermissionUser,
  Survey,
  User,
  UserCustomField,
  UserSurveyAlias,
} from '@intake24/db';
import { CreateRespondentInput, UpdateRespondentInput } from '@intake24/common/types/http/admin';
import { UserCustomFieldAttributes } from '@intake24/common/types/models';
import { ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import { toSimpleName } from '@intake24/api/util';
import { randomString } from '@intake24/common/util';
import { surveyMgmt, surveyRespondent } from '../core/auth';

const adminSurveyService = ({
  adminUserService,
  securityConfig,
  scheduler,
}: Pick<IoC, 'adminUserService' | 'securityConfig' | 'scheduler'>) => {
  /**
   * Fetch survey-specific respondent permission instance or create one
   *
   * @param {string} surveyId
   * @returns {Promise<Permission>}
   */
  const getSurveyRespondentPermission = async (surveyId: string): Promise<Permission> => {
    const name = surveyRespondent(surveyId);
    const [permission] = await Permission.findOrCreate({
      where: { name },
      defaults: { name, displayName: name },
    });

    return permission;
  };

  /**
   * Fetch survey-specific management permission instances
   *
   * @param {string} surveyId
   * @param {(string | string[])} [scope=[]]
   * @returns {Promise<Permission[]>}
   */
  const getSurveyMgmtPermissions = async (
    surveyId: string,
    scope: string | string[] = []
  ): Promise<Permission[]> =>
    Permission.scope(scope).findAll({
      where: { name: surveyMgmt(surveyId) },
      order: [['name', 'ASC']],
    });

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
   * Get survey permissions
   *
   * @param {string} surveyId
   * @param {(string | string[])} [scope=[]]
   * @returns {Promise<Permission[]>}
   */
  const getSurveyPermissions = async (
    surveyId: string,
    scope: string | string[] = []
  ): Promise<Permission[]> =>
    Permission.scope(scope).findAll({
      where: { name: { [Op.or]: [surveyMgmt(surveyId), { [Op.startsWith]: 'surveys-' }] } },
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

    const { id: surveyId, authUrlTokenCharset, authUrlTokenLength } = surveyEntry;
    const { password, userName, ...rest } = input;

    const user = await User.create(
      { ...rest, simpleName: toSimpleName(rest.name) },
      { include: [UserCustomField] }
    );

    const { id: userId } = user;
    const { size, alphabet } = securityConfig.authTokens;

    const surveyRespondentPermission = await getSurveyRespondentPermission(surveyId);

    const [respondent] = await Promise.all([
      UserSurveyAlias.create({
        userId,
        surveyId,
        userName,
        urlAuthToken: randomString(authUrlTokenLength ?? size, authUrlTokenCharset ?? alphabet),
      }),
      user.$add('permissions', surveyRespondentPermission),
      adminUserService.createPassword({ userId, password }),
    ]);

    return respondent;
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

    const { id: permissionId } = await getSurveyRespondentPermission(surveyId);
    const { size, alphabet } = securityConfig.authTokens;

    const urlTokenCharset = survey.authUrlTokenCharset ?? alphabet;
    const urlTokenLength = survey.authUrlTokenLength ?? size;

    const userAliases = [];
    const userCustomFields: Omit<UserCustomFieldAttributes, 'id'>[] = [];
    const userPasswords = [];
    const userPermissions = [];

    for (const input of inputs) {
      const { customFields, password, userName, ...rest } = input;
      // User records are created one-by-one
      // This is to keep it MySQL+others-like compatible, where bulk operation doesn't return generated IDs
      const { id: userId } = await User.create({ ...rest, simpleName: toSimpleName(rest.name) });

      if (customFields && customFields.length) {
        customFields.forEach((field) => {
          userCustomFields.push({ ...field, userId });
        });
      }

      userAliases.push({
        userId,
        surveyId,
        userName,
        urlAuthToken: randomString(urlTokenLength, urlTokenCharset),
      });
      userPermissions.push({ userId, permissionId });
      userPasswords.push({ userId, password });
    }

    const [userAliasRecords] = await Promise.all([
      UserSurveyAlias.bulkCreate(userAliases),
      PermissionUser.bulkCreate(userPermissions),
      adminUserService.createPasswords(userPasswords),
      UserCustomField.bulkCreate(userCustomFields),
    ]);

    return userAliasRecords;
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
    const survey = await Survey.findByPk(surveyId);
    const user = await User.scope('customFields').findOne({
      include: [{ model: UserSurveyAlias, where: { userId, surveyId } }],
    });

    if (!survey || !user || !user.aliases) throw new NotFoundError();

    const { customFields, password, ...rest } = input;

    await user.update({ ...rest, simpleName: toSimpleName(rest.name) });
    if (password) await adminUserService.updatePassword(user.id, password);

    // Update custom fields
    if (customFields && user.customFields)
      await adminUserService.updateUserCustomFields(userId, user.customFields, customFields);

    await adminUserService.flushACLCache(user.id);

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
    const user = await User.scope('submissions').findOne({
      where: { id: userId },
      include: [{ model: UserSurveyAlias, where: { surveyId } }],
    });

    if (!user) throw new NotFoundError();

    if (user.submissions?.length)
      throw new ForbiddenError('User cannot be deleted. It already contains submission data.');

    // System-wide account - delete only access to study
    if (user.email) {
      await Promise.all([
        UserSurveyAlias.destroy({ where: { surveyId, userId } }),
        user.$remove('permissions', await getSurveyRespondentPermission(surveyId)),
      ]);
    } else {
      // Wipe the whole user records
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
    getSurveyMgmtPermissions,
    getSurveyResourcePermissions,
    getSurveyPermissions,
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
