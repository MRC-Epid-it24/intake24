import { nanoid } from 'nanoid';
import * as uuid from 'uuid';
import { CreateRespondentInput, UpdateRespondentInput } from '@common/types/http/admin';
import { UserCustomField as UserCustomFieldAttributes } from '@common/types/models';
import {
  GenUserCounter,
  Job,
  Permission,
  PermissionUser,
  Survey,
  SurveySubmission,
  SurveySubmissionCustomField,
  SurveySubmissionMeal,
  SurveySubmissionMealCustomField,
  User,
  UserCustomField,
  UserSurveyAlias,
} from '@/db/models/system';
import { ForbiddenError, InternalServerError, NotFoundError } from '@/http/errors';
import type { IoC } from '@/ioc';
import { toSimpleName, generateToken } from '@/util';
import { RecallState } from '@common/types';
import { surveyMgmt, surveyRespondent } from './auth';

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
  submit: (surveyId: string, userId: number, input: RecallState) => Promise<void>;
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

    const { authUrlTokenCharset, authUrlTokenLength } = survey;

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
      urlAuthToken: generateToken(authUrlTokenLength ?? size, authUrlTokenCharset ?? alphabet),
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
        urlAuthToken: generateToken(urlTokenLength, urlTokenCharset),
      });
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

    await userService.flushACLCache(user.id);

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

  /**
   * Submit survey recall
   *
   * @param {string} surveyId
   * @param {number} userId
   * @param {RecallState} input
   * @returns {Promise<void>}
   */
  const submit = async (surveyId: string, userId: number, input: RecallState): Promise<void> => {
    const survey = await Survey.scope('scheme').findByPk(surveyId);
    if (!survey || !survey.scheme) throw new NotFoundError();

    const {
      preMeals,
      postMeals,
      meals: { preFoods, postFoods },
    } = survey.scheme.questions;

    const surveyCustomQuestions = [...preMeals, ...postMeals]
      .filter((question) => question.type === 'custom')
      .map((question) => question.id);

    const mealCustomQuestions = [...preFoods, ...postFoods]
      .filter((question) => question.type === 'custom')
      .map((question) => question.id);

    /*
     * TODO: this could be pushed to background job
     * - store state in DB for processing, processed as job, deleted successfully process data or mark as an issue in Admin Tool to reconcile
     * - response to user is not delayed by processing bigger amount of data
     * - it depends, whether we want to throw any errors / discrepancies back to user
     * - all submission data should be validated in frontend, user probably won't be able to do any corrections unless specifically allowed?
     */

    // Survey submission
    const { id: surveySubmissionId } = await SurveySubmission.create({
      id: uuid.v4(),
      surveyId,
      userId,
      startTime: input.startTime,
      endTime: input.endTime,
      uxSessionId: uuid.v4(), // TODO: verify this
      submissionTime: new Date(),
    });

    // Survey custom fields - top-level questions
    const surveyCustomFieldInputs = [...input.preMeals, ...input.postMeals]
      // Filter out null answers (conditionally skipped prompt)
      .filter((item) => surveyCustomQuestions.includes(item.questionId) && item.answer)
      .map((item) => ({
        surveySubmissionId,
        name: item.questionId,
        value: Array.isArray(item.answer) ? item.answer.join(', ') : item.answer,
      }));

    await SurveySubmissionCustomField.bulkCreate(surveyCustomFieldInputs);

    // Survey meals
    const mealInputs = input.meals.map(({ name, time }) => {
      const [hours, minutes] = time.split(':');
      return {
        surveySubmissionId,
        name,
        hours,
        minutes,
      };
    });

    await SurveySubmissionMeal.bulkCreate(mealInputs);
    const meals = await SurveySubmissionMeal.findAll({
      where: { surveySubmissionId },
      order: [['id', 'ASC']],
    });

    // We could iterate with index and access meal record by index, records should be created in same order
    for (const mealInput of input.meals) {
      const mealRecord = meals.find((meal) => meal.name === mealInput.name);
      // This shouldn't really happen
      if (!mealRecord) throw new InternalServerError();

      // Meal custom fields - meal-level questions
      const mealCustomFieldInputs = [...mealInput.preFoods, ...mealInput.postFoods]
        // Filter out null answers (conditionally skipped prompt)
        .filter((item) => mealCustomQuestions.includes(item.questionId) && item.answer)
        .map((item) => ({
          mealId: mealRecord.id,
          name: item.questionId,
          value: Array.isArray(item.answer) ? item.answer.join(', ') : item.answer,
        }));

      await SurveySubmissionMealCustomField.bulkCreate(mealCustomFieldInputs);

      // TODO: process foods
    }
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
    submit,
  };
};
