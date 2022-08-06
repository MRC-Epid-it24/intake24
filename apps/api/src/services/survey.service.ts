import { addDays, addMinutes, startOfDay } from 'date-fns';
import { randomUUID } from 'node:crypto';

import type { IoC } from '@intake24/api/ioc';
import type { PromptQuestion, RedirectPromptProps } from '@intake24/common/prompts';
import type { SurveyState } from '@intake24/common/types';
import type { SurveyFollowUpResponse, SurveyUserInfoResponse } from '@intake24/common/types/http';
import type { FindOptions, SubmissionScope } from '@intake24/db';
import {
  ApplicationError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from '@intake24/api/http/errors';
import { jwt } from '@intake24/api/util';
import { randomString } from '@intake24/common/util';
import {
  FeedbackScheme,
  GenUserCounter,
  Op,
  submissionScope,
  Survey,
  SurveyScheme,
  SurveySubmission,
  SurveySubmissionCustomField,
  SurveySubmissionMeal,
  SurveySubmissionMealCustomField,
  User,
  UserCustomField,
  UserSurveyAlias,
  UserSurveySession,
} from '@intake24/db';

export type RespondentWithPassword = {
  respondent: UserSurveyAlias;
  password: string;
};

export type RespondentFromJWT = {
  userId: string;
  redirect: string;
  authToken: string;
};

const surveyService = ({
  adminSurveyService,
  cache,
  scheduler,
}: Pick<IoC, 'adminSurveyService' | 'cache' | 'scheduler'>) => {
  /**
   * Generate random survey respondent
   *
   * @param {string} slug
   * @returns {Promise<RespondentWithPassword>}
   */
  const generateRespondent = async (slug: string): Promise<RespondentWithPassword> => {
    const survey = await Survey.scope('counter').findOne({ where: { slug } });
    if (!survey) throw new NotFoundError();

    const { id: surveyId, allowGenUsers, genUserKey } = survey;

    if (!allowGenUsers || genUserKey) throw new ForbiddenError();

    let { counter } = survey;
    if (counter) await counter.increment('count');
    else counter = await GenUserCounter.create({ surveyId, count: 1 });

    const username = `${slug}${counter.count}`;
    const password = randomString(12);

    const respondent = await adminSurveyService.createRespondent(survey, { username, password });

    return { respondent, password };
  };

  /**
   * Generate respondent based on supplied JWT payload
   *
   * @param {string} slug
   * @param {string} params
   * @returns {Promise<RespondentFromJWT>}
   */
  const createRespondentWithJWT = async (
    slug: string,
    params: string
  ): Promise<RespondentFromJWT> => {
    const survey = await Survey.findOne({ where: { slug } });
    if (!survey) throw new NotFoundError();

    const { id: surveyId, allowGenUsers, genUserKey } = survey;

    if (!allowGenUsers || !genUserKey)
      throw new ForbiddenError(`Survey doesn't support user generation`);

    let decoded;

    try {
      decoded = await jwt.verify(params, genUserKey, {
        algorithms: ['HS256', 'HS512'],
      });
    } catch (err) {
      throw new ForbiddenError(err instanceof Error ? err.message : undefined);
    }

    if (!decoded || Object.prototype.toString.call(decoded) !== '[object Object]')
      throw new ApplicationError('Malformed token payload');

    if (!decoded || typeof decoded === 'string')
      throw new ApplicationError('Malformed token payload');

    const { user: username, redirect } = decoded;
    if (!username || typeof username !== 'string')
      throw new ApplicationError('Missing claim: user');
    if (!redirect || typeof redirect !== 'string')
      throw new ApplicationError('Missing claim: redirect');

    const alias = await UserSurveyAlias.findOne({ where: { surveyId, username } });
    if (alias) {
      const { userId, urlAuthToken: authToken } = alias;

      return { userId, redirect, authToken };
    }

    const { userId, urlAuthToken: authToken } = await adminSurveyService.createRespondent(survey, {
      username,
      password: randomString(12),
    });

    return { userId, redirect, authToken };
  };

  /**
   * User information for survey
   *
   * @param {string} slug
   * @param {User} user
   * @param {number} tzOffset
   * @returns {Promise<SurveyUserInfoResponse>}
   */
  const userInfo = async (
    slug: string,
    { id: userId, name }: User,
    tzOffset: number
  ): Promise<SurveyUserInfoResponse> => {
    const survey = await Survey.findOne({ where: { slug } });
    if (!survey) throw new NotFoundError();

    const { id: surveyId, maximumTotalSubmissions, maximumDailySubmissions } = survey;

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
   * @param {string} slug
   * @param {string} userId
   * @returns {Promise<UserSurveySession>}
   */
  const getSession = async (slug: string, userId: string): Promise<UserSurveySession> => {
    const survey = await Survey.findOne({ where: { slug } });
    if (!survey) throw new NotFoundError();

    const { id: surveyId, storeUserSessionOnServer } = survey;

    if (!storeUserSessionOnServer) throw new ForbiddenError();

    const session = await UserSurveySession.findOne({ where: { userId, surveyId } });
    if (!session) throw new NotFoundError();

    return session;
  };

  /**
   * Save respondent's survey session / recall state
   *
   * @param {string} slug
   * @param {string} userId
   * @param {SurveyState} sessionData
   * @returns {Promise<UserSurveySession>}
   */
  const setSession = async (
    slug: string,
    userId: string,
    sessionData: SurveyState
  ): Promise<UserSurveySession> => {
    const survey = await Survey.findOne({ where: { slug } });
    if (!survey) throw new NotFoundError();

    const { id: surveyId, storeUserSessionOnServer } = survey;

    if (!storeUserSessionOnServer) throw new ForbiddenError();

    const [session] = await UserSurveySession.upsert(
      { userId, surveyId, sessionData },
      { fields: ['sessionData'] }
    );

    return session;
  };

  /**
   * Get user's submissions
   *
   * @param {SubmissionScope} scopeOptions
   * @param {FindOptions} [options={}]
   * @returns {Promise<SurveySubmission[]>}
   */
  const getSubmissions = async (
    scopeOptions: SubmissionScope,
    options: FindOptions = {}
  ): Promise<SurveySubmission[]> =>
    SurveySubmission.findAll(submissionScope(scopeOptions, options));

  /**
   * Resolve follow-up URL, if any
   *
   * @param {Survey} survey
   * @param {string} userId
   * @returns {(Promise<string | null>)}
   */
  const getFollowUpUrl = async (survey: Survey, userId: string): Promise<string | null> => {
    const { id: surveyId, surveyScheme } = survey;
    if (!surveyScheme) throw new NotFoundError();

    const redirectPrompt = surveyScheme.questions.submission.find(
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
        identifierValue = user.id;
        break;
      case 'username':
        identifierValue = aliases.length ? aliases[0].username : null;
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
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  const canShowFeedback = async (survey: Survey, userId: string): Promise<boolean> => {
    const { id: surveyId, feedbackScheme, numberOfSubmissionsForFeedback } = survey;
    if (!feedbackScheme) return false;

    const submissions = await SurveySubmission.count({ where: { surveyId, userId } });

    return numberOfSubmissionsForFeedback >= submissions;
  };

  /**
   * Submit survey recall
   *
   * @param {string} slug
   * @param {string} userId
   * @param {RecallState} input
   * @returns {Promise<void>}
   */
  const submit = async (
    slug: string,
    userId: string,
    input: SurveyState
  ): Promise<SurveyFollowUpResponse> => {
    const survey = await Survey.findOne({
      where: { slug },
      include: [{ model: SurveyScheme, required: true }, { model: FeedbackScheme }],
    });
    if (!survey || !survey.surveyScheme) throw new NotFoundError();

    const {
      id: surveyId,
      surveyScheme: {
        questions: {
          preMeals,
          postMeals,
          meals: { preFoods, postFoods },
        },
      },
      submissionNotificationUrl,
    } = survey;

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
     * - critical data (inserted in DB) should be also validated in backend
     */

    // Survey submission
    const { id: surveySubmissionId } = await SurveySubmission.create({
      id: randomUUID(),
      surveyId,
      userId,
      startTime: input.startTime ?? new Date(),
      endTime: input.endTime ?? new Date(),
      uxSessionId: randomUUID(), // TODO: verify this
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

    // Clean user submissions cache and dispatch submission webhook if any
    await Promise.all(
      [
        cache.forget(`user:submissions:${userId}`),
        submissionNotificationUrl
          ? scheduler.jobs.addJob(
              { type: 'SurveySubmissionNotification', userId },
              { surveyId, submissionId: surveySubmissionId }
            )
          : null,
      ].map(Boolean)
    );

    const [followUpUrl, showFeedback] = await Promise.all([
      getFollowUpUrl(survey, userId),
      canShowFeedback(survey, userId),
    ]);

    return { followUpUrl, showFeedback };
  };

  const followUp = async (slug: string, userId: string): Promise<SurveyFollowUpResponse> => {
    const survey = await Survey.findOne({
      where: { slug },
      include: [{ model: SurveyScheme, required: true }, { model: FeedbackScheme }],
    });
    if (!survey || !survey.surveyScheme) throw new NotFoundError();

    const [followUpUrl, showFeedback] = await Promise.all([
      getFollowUpUrl(survey, userId),
      canShowFeedback(survey, userId),
    ]);

    return { followUpUrl, showFeedback };
  };

  return {
    generateRespondent,
    createRespondentWithJWT,
    userInfo,
    getSession,
    setSession,
    getSubmissions,
    submit,
    followUp,
  };
};

export default surveyService;

export type SurveyService = ReturnType<typeof surveyService>;
