import { startOfDay, addMinutes, addDays } from 'date-fns';
import { nanoid } from 'nanoid';
import { Op } from 'sequelize';
import * as uuid from 'uuid';
import { CreateRespondentInput, UpdateRespondentInput } from '@common/types/http/admin';
import { UserCustomFieldAttributes } from '@common/types/models';
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
  UserSession,
  UserSurveyAlias,
} from '@/db/models/system';
import { ForbiddenError, InternalServerError, NotFoundError } from '@/http/errors';
import type { IoC } from '@/ioc';
import { toSimpleName, generateToken } from '@/util';
import { SurveyState } from '@common/types';
import { SurveyUserInfoResponse, SurveyFollowUpResponse } from '@common/types/http';
import { PromptQuestion, RedirectPromptProps } from '@common/prompts';
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
    userId: number,
    input: UpdateRespondentInput
  ) => Promise<UserSurveyAlias>;
  deleteRespondent: (surveyId: string, userId: string | number) => Promise<void>;
  generateRespondent: (surveyId: string) => Promise<RespondentWithPassword>;
  importRespondents: (surveyId: string, userId: number, file: Express.Multer.File) => Promise<Job>;
  exportAuthenticationUrls: (surveyId: string, userId: number) => Promise<Job>;
  userInfo: (surveyId: string, user: User, tzOffset: number) => Promise<SurveyUserInfoResponse>;
  getSession: (surveyId: string, userId: number) => Promise<UserSession>;
  setSession: (surveyId: string, userId: number, sessionData: SurveyState) => Promise<UserSession>;
  submit: (surveyId: string, userId: number, input: SurveyState) => Promise<SurveyFollowUpResponse>;
  followUp: (surveyId: string, userId: number) => Promise<SurveyFollowUpResponse>;
}

export default ({
  securityConfig,
  scheduler,
  userService,
}: Pick<IoC, 'securityConfig' | 'scheduler' | 'userService'>): SurveyService => {
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
    const { size, alphabet } = securityConfig.authTokens;

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
        urlAuthToken: generateToken(urlTokenLength, urlTokenCharset),
      });
      userPermissions.push({ userId, permissionId });
      userPasswords.push({ userId, password });
    }

    const [userAliasRecords] = await Promise.all([
      UserSurveyAlias.bulkCreate(userAliases),
      PermissionUser.bulkCreate(userPermissions),
      userService.createPasswords(userPasswords),
      UserCustomField.bulkCreate(userCustomFields),
    ]);

    return userAliasRecords;
  };

  /**
   * Update respondent record
   *
   * @param {string} surveyId
   * @param {number} userId
   * @param {UpdateRespondentInput} input
   * @returns {Promise<UserSurveyAlias>}
   */
  const updateRespondent = async (
    surveyId: string,
    userId: number,
    input: UpdateRespondentInput
  ): Promise<UserSurveyAlias> => {
    const survey = await Survey.findByPk(surveyId);
    const user = await User.scope('customFields').findOne({
      include: [{ model: UserSurveyAlias, where: { userId, surveyId } }],
    });

    if (!survey || !user || !user.aliases) throw new NotFoundError();

    const { customFields, password, ...rest } = input;

    await user.update({ ...rest, simpleName: toSimpleName(rest.name) });
    if (password) await userService.updatePassword({ userId: user.id, password });

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
   * User information for survey
   *
   * @param {string} surveyId
   * @param {User} user
   * @param {number} tzOffset
   * @returns {Promise<SurveyUserInfoResponse>}
   */
  const userInfo = async (
    surveyId: string,
    { id: userId, name }: User,
    tzOffset: number
  ): Promise<SurveyUserInfoResponse> => {
    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    const { maximumTotalSubmissions, maximumDailySubmissions } = survey;

    const clientStartOfDay = addMinutes(startOfDay(new Date()), tzOffset * -1);
    const clientEndOfDay = addDays(clientStartOfDay, 1);

    const [totalSubmissions, daySubmissions] = await Promise.all([
      SurveySubmission.count({ where: { surveyId, userId } }),
      SurveySubmission.count({
        where: {
          surveyId,
          userId,
          submissionTime: { [Op.gte]: clientStartOfDay, [Op.lt]: clientEndOfDay },
        },
      }),
    ]);

    return {
      userId,
      name,
      recallNumber: totalSubmissions + 1,
      redirectToFeedback: totalSubmissions >= survey.numberOfSubmissionsForFeedback,
      maximumTotalSubmissionsReached:
        maximumTotalSubmissions !== null && totalSubmissions >= maximumTotalSubmissions,
      maximumDailySubmissionsReached:
        maximumDailySubmissions !== null && daySubmissions >= maximumDailySubmissions,
    };
  };

  /**
   * Get respondent's survey session / recall state
   *
   * @param {string} surveyId
   * @param {number} userId
   * @returns {Promise<UserSession>}
   */
  const getSession = async (surveyId: string, userId: number): Promise<UserSession> => {
    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    if (!survey.storeUserSessionOnServer) throw new ForbiddenError();

    const session = await UserSession.findOne({ where: { userId, surveyId } });
    if (!session) throw new NotFoundError();

    return session;
  };

  /**
   * Save respondent's survey session / recall state
   *
   * @param {string} surveyId
   * @param {number} userId
   * @param {SurveyState} sessionData
   * @returns {Promise<UserSession>}
   */
  const setSession = async (
    surveyId: string,
    userId: number,
    sessionData: SurveyState
  ): Promise<UserSession> => {
    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    if (!survey.storeUserSessionOnServer) throw new ForbiddenError();

    const [session] = await UserSession.upsert(
      { userId, surveyId, sessionData },
      { fields: ['sessionData'] }
    );

    return session;
  };

  /**
   * Resolve follow-up URL, if any
   *
   * @param {Survey} survey
   * @param {number} userId
   * @returns {(Promise<string | null>)}
   */
  const getFollowUpUrl = async (survey: Survey, userId: number): Promise<string | null> => {
    const { id: surveyId, scheme } = survey;
    if (!scheme) throw new NotFoundError();

    const redirectPrompt = scheme.questions.submission.find(
      (question) => question.component === 'redirect-prompt'
    );
    if (!redirectPrompt) return null;

    const user = await User.findByPk(userId, {
      include: [
        { model: UserSurveyAlias, where: { surveyId }, required: false },
        { model: UserCustomField, where: { name: 'redirect url' }, required: false },
      ],
    });

    if (!user) throw new NotFoundError();
    const { aliases = [], customFields = [] } = user;

    const { identifier, url } = (redirectPrompt as PromptQuestion<RedirectPromptProps>).props;

    let identifierValue: string | null;

    switch (identifier) {
      case 'userId':
        identifierValue = user.id.toString();
        break;
      case 'username':
        identifierValue = aliases.length ? aliases[0].userName : null;
        break;
      case 'token':
        identifierValue = aliases.length ? aliases[0].urlAuthToken : null;
        break;
      case 'custom':
        identifierValue = customFields.length ? customFields[0].value : null;
        break;
      default:
        identifierValue = null;
        break;
    }

    if (!identifierValue) return null;

    return url?.replace('{identifier}', identifierValue) ?? null;
  };

  /**
   * Verify that user can be offered a feedback
   *
   * @param {Survey} survey
   * @param {number} userId
   * @returns {Promise<boolean>}
   */
  const canShowFeedback = async (survey: Survey, userId: number): Promise<boolean> => {
    const { feedbackEnabled, numberOfSubmissionsForFeedback } = survey;
    if (!feedbackEnabled) return false;

    const submissions = await SurveySubmission.count({
      where: { surveyId: survey.id, userId },
    });

    return numberOfSubmissionsForFeedback >= submissions;
  };

  /**
   * Submit survey recall
   *
   * @param {string} surveyId
   * @param {number} userId
   * @param {RecallState} input
   * @returns {Promise<void>}
   */
  const submit = async (
    surveyId: string,
    userId: number,
    input: SurveyState
  ): Promise<SurveyFollowUpResponse> => {
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
      startTime: input.startTime ?? new Date(),
      endTime: input.endTime ?? new Date(),
      uxSessionId: uuid.v4(), // TODO: verify this
      submissionTime: new Date(),
    });

    // Survey custom fields - top-level questions
    const surveyCustomFieldInputs = Object.entries(input.customPromptAnswers)
      .filter(([questionId]) => surveyCustomQuestions.includes(questionId))
      .map(([questionId, answer]) => ({
        surveySubmissionId,
        name: questionId,
        value: Array.isArray(answer) ? answer.join(', ') : answer.toString(),
      }));

    await SurveySubmissionCustomField.bulkCreate(surveyCustomFieldInputs);

    // Survey meals
    const mealInputs = input.meals.map(({ name, time }) => ({
      surveySubmissionId,
      name,
      hours: time?.hours ?? 8,
      minutes: time?.minutes ?? 0,
    }));

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
      const mealCustomFieldInputs = Object.entries(mealInput.customPromptAnswers)
        .filter(([questionId]) => mealCustomQuestions.includes(questionId))
        .map(([questionId, answer]) => ({
          mealId: mealRecord.id,
          name: questionId,
          value: Array.isArray(answer) ? answer.join(', ') : answer.toString(),
        }));

      await SurveySubmissionMealCustomField.bulkCreate(mealCustomFieldInputs);

      // TODO: process foods
    }

    if (survey.submissionNotificationUrl) {
      await scheduler.jobs.addJob(
        { type: 'SurveySubmissionNotification', userId },
        { surveyId, submissionId: surveySubmissionId }
      );
    }

    const [followUpUrl, showFeedback] = await Promise.all([
      getFollowUpUrl(survey, userId),
      canShowFeedback(survey, userId),
    ]);

    return { followUpUrl, showFeedback };
  };

  const followUp = async (surveyId: string, userId: number): Promise<SurveyFollowUpResponse> => {
    const survey = await Survey.scope('scheme').findByPk(surveyId);
    if (!survey || !survey.scheme) throw new NotFoundError();

    const [followUpUrl, showFeedback] = await Promise.all([
      getFollowUpUrl(survey, userId),
      canShowFeedback(survey, userId),
    ]);

    return { followUpUrl, showFeedback };
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
    userInfo,
    getSession,
    setSession,
    submit,
    followUp,
  };
};
