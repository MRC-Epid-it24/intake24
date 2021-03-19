import { nanoid } from 'nanoid';
import { CreateRespondentInput, UpdateRespondentInput } from '@common/types/http/admin';
import { UserCustomField as UserCustomFieldAttributes } from '@common/types/models';
import {
  GenUserCounter,
  Job,
  Permission,
  PermissionUser,
  Survey,
  User,
  UserCustomField,
  UserSurveyAlias,
} from '@/db/models/system';
import { ForbiddenError, NotFoundError } from '@/http/errors';
import type { IoC } from '@/ioc';
import { toSimpleName, generateToken } from '@/util';
import { surveyMgmt, surveyRespondent } from './acl.service';

export type RespondentWithPassword = {
  respondent: UserSurveyAlias;
  password: string;
};

export interface SurveyService {
  getSurveyRespondentPermission: (surveyId: string) => Promise<Permission>;
  getSurveyMgmtPermissions: (surveyId: string, scope?: string | string[]) => Promise<Permission[]>;
  createRespondent: (surveyId: string, input: CreateRespondentInput) => Promise<UserSurveyAlias>;
  createRespondents: (
    surveyId: string,
    inputs: CreateRespondentInput[]
  ) => Promise<UserSurveyAlias[]>;
  updateRespondent: (
    surveyId: string,
    userId: string | number,
    input: UpdateRespondentInput
  ) => Promise<UserSurveyAlias>;
  deleteRespondent: (surveyId: string, userId: string | number) => Promise<void>;
  generateRespondent: (surveyId: string) => Promise<RespondentWithPassword>;
  importRespondents: (surveyId: string, userId: number, file: Express.Multer.File) => Promise<Job>;
  exportAuthenticationUrls: (surveyId: string, userId: number) => Promise<Job>;
}

export default ({
  config,
  scheduler,
  userService,
}: Pick<IoC, 'config' | 'scheduler' | 'userService'>): SurveyService => {
  /**
   * Fetch survey-specific respondent permission instance
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
  ): Promise<Permission[]> => {
    return Permission.scope(scope).findAll({ where: { name: surveyMgmt(surveyId) } });
  };

  /**
   * Create respondent record
   *
   * @param {string} surveyId
   * @param {CreateRespondentRequest} input
   * @returns {Promise<UserSurveyAlias>}
   */
  const createRespondent = async (
    surveyId: string,
    input: CreateRespondentInput
  ): Promise<UserSurveyAlias> => {
    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    const { password, userName, ...rest } = input;
    const user = await User.create(
      { ...rest, simpleName: toSimpleName(rest.name) },
      { include: [UserCustomField] }
    );

    await user.$add('permissions', await getSurveyRespondentPermission(surveyId));

    const { id: userId } = user;
    const { size, alphabet } = config.security.authTokens;

    const respondent = await UserSurveyAlias.create({
      userId,
      surveyId,
      userName,
      urlAuthToken: generateToken(size, alphabet),
    });

    await userService.createPassword({ userId, password });

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
    const { size, alphabet } = config.security.authTokens;

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

      userAliases.push({ userId, surveyId, userName, urlAuthToken: generateToken(size, alphabet) });
      userPermissions.push({ userId, permissionId });
      userPasswords.push({ userId, password });
    }

    await Promise.all([
      PermissionUser.bulkCreate(userPermissions),
      userService.createPasswords(userPasswords),
      UserCustomField.bulkCreate(userCustomFields),
    ]);

    return UserSurveyAlias.bulkCreate(userAliases);
  };

  /**
   * Update respondent record
   *
   * @param {string} surveyId
   * @param {(string | number)} userId
   * @param {UpdateRespondentInput} input
   * @returns {Promise<UserSurveyAlias>}
   */
  const updateRespondent = async (
    surveyId: string,
    userId: string | number,
    input: UpdateRespondentInput
  ): Promise<UserSurveyAlias> => {
    const survey = await Survey.findByPk(surveyId);
    const user = await User.scope('customFields').findOne({
      include: [{ model: UserSurveyAlias, where: { userId, surveyId } }],
    });

    if (!survey || !user || !user.aliases) throw new NotFoundError();

    const { customFields, password, ...rest } = input;

    await user.update({ ...rest, simpleName: toSimpleName(rest.name) });
    if (password) userService.updatePassword({ userId: user.id, password });

    // Update custom fields
    if (customFields && user.customFields)
      await userService.updateUserCustomFields(userId, user.customFields, customFields);

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
      await UserSurveyAlias.destroy({ where: { surveyId, userId } });
      await user.$remove('permissions', await getSurveyRespondentPermission(surveyId));
    } else {
      // Wipe the whole user records
      await user.destroy();
    }
  };

  /**
   * Generate new random survey respondent
   *
   * @param {string} surveyId
   * @returns {Promise<RespondentWithPassword>}
   */
  const generateRespondent = async (surveyId: string): Promise<RespondentWithPassword> => {
    const survey = await Survey.scope('counter').findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    if (!survey.allowGenUsers) throw new ForbiddenError();

    let { counter } = survey;
    if (counter) await counter.increment('count');
    else counter = await GenUserCounter.create({ surveyId, count: 1 });

    const userName = `${surveyId}${counter.count}`;
    const password = nanoid(8);

    const respondent = await createRespondent(surveyId, { userName, password });

    return { respondent, password };
  };

  /**
   * Bulk import of survey respondents
   * - runs as a job
   * - temporarily stores CSV file
   *
   * @param {string} surveyId
   * @param {number} userId
   * @param {Express.Multer.File} file
   * @returns {Promise<Job>}
   */
  const importRespondents = async (
    surveyId: string,
    userId: number,
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
   * @param {number} userId
   * @returns {Promise<Job>}
   */
  const exportAuthenticationUrls = async (surveyId: string, userId: number): Promise<Job> => {
    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    return scheduler.jobs.addJob({ type: 'SurveyExportRespondentAuthUrls', userId }, { surveyId });
  };

  return {
    getSurveyRespondentPermission,
    getSurveyMgmtPermissions,
    createRespondent,
    createRespondents,
    updateRespondent,
    deleteRespondent,
    generateRespondent,
    importRespondents,
    exportAuthenticationUrls,
  };
};
