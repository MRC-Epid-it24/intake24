import { URL } from 'node:url';

import { addDays, addMinutes, startOfDay } from 'date-fns';
import { z, ZodError } from 'zod';

import type { IoC } from '@intake24/api/ioc';
import type { Prompts } from '@intake24/common/prompts';
import type {
  CreateUserResponse,
  SurveyRatingRequest,
  SurveyUserInfoResponse,
} from '@intake24/common/types/http';
import type { FindOptions, Includeable, SubmissionScope } from '@intake24/db';
import { ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import { jwt } from '@intake24/api/util';
import { strongPassword } from '@intake24/common/security';
import { customField, type JobParams, type SurveyState } from '@intake24/common/types';
import { isSessionAgeValid, isSessionFixedPeriodValid, randomString } from '@intake24/common/util';
import {
  GenUserCounter,
  Op,
  submissionScope,
  Survey,
  SurveySubmission,
  User,
  UserSurveyAlias,
  UserSurveyRating,
  UserSurveySession,
} from '@intake24/db';

export type RespondentWithPassword = {
  respondent: UserSurveyAlias;
  password: string;
};

function surveyService({
  adminSurveyService,
  adminUserService,
  logger: globalLogger,
  scheduler,
}: Pick<IoC, 'adminSurveyService' | 'adminUserService' | 'logger' | 'scheduler'>) {
  const logger = globalLogger.child({ service: 'SurveyService' });

  /**
   * Generate random survey respondent
   *
   * @param {string} slug
   * @returns {Promise<RespondentWithPassword>}
   */
  const generateRespondent = async (slug: string): Promise<RespondentWithPassword> => {
    const survey = await Survey.findBySlug(slug, {
      attributes: [
        'id',
        'slug',
        'allowGenUsers',
        'genUserKey',
        'authUrlTokenCharset',
        'authUrlTokenLength',
        'userCustomFields',
        'userPersonalIdentifiers',
      ],
      include: [{ association: 'counter' }],
    });
    if (!survey)
      throw new NotFoundError();

    const { id: surveyId, allowGenUsers, genUserKey } = survey;

    if (!allowGenUsers || genUserKey)
      throw new ForbiddenError();

    let { counter } = survey;
    if (counter)
      await counter.increment('count');
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
   * @param {string} token
   * @returns {Promise<CreateUserResponse>}
   */
  const createRespondentWithJWT = async (
    slug: string,
    token: string,
  ): Promise<CreateUserResponse> => {
    const survey = await Survey.findBySlug(slug, {
      attributes: [
        'id',
        'slug',
        'allowGenUsers',
        'genUserKey',
        'authUrlTokenCharset',
        'authUrlTokenLength',
        'userCustomFields',
        'userPersonalIdentifiers',
      ],
    });
    if (!survey)
      throw new NotFoundError();

    const { id: surveyId, allowGenUsers, genUserKey } = survey;

    if (!allowGenUsers || !genUserKey)
      throw new ForbiddenError(`Survey doesn't support user generation`);

    try {
      const decoded = await jwt.verify(token, genUserKey, { algorithms: ['HS256', 'HS512'] });
      const { name, password, username, redirectUrl, customFields } = z
        .object({
          username: z.string().min(1).max(256),
          // TODO: revert to strong password policy once SHS can adopt
          password: ['shs24', 'shs24d'].includes(survey.slug) ? z.string().min(7).optional() : strongPassword.optional(),
          redirectUrl: z.string().url().optional(),
          name: z.string().min(1).max(512).nullish(),
          customFields: customField.array().optional(),
        })
        .parse(decoded);

      const alias = await UserSurveyAlias.findOne(
        {
          include: [{
            association: 'user',
            attributes: ['id', 'name'],
            required: true,
            include: [{ association: 'customFields', attributes: ['name', 'value'] }],
          }],
          where: { surveyId, username },
        },
      );

      if (alias?.user) {
        const { userId, urlAuthToken: authToken, user } = alias;

        const payload: CreateUserResponse = { userId, username, authToken, redirectUrl };

        if (survey.userPersonalIdentifiers) {
          await user.update({ name });
          payload.name = name ?? user.name;
        }

        if (survey.userCustomFields) {
          if (customFields && user.customFields)
            await adminUserService.updateUserCustomFields(userId, user.customFields, customFields);

          payload.customFields = customFields ?? user.customFields;
        }

        return payload;
      }

      const { userId, urlAuthToken: authToken } = await adminSurveyService.createRespondent(
        survey,
        { username, password, name, customFields },
      );

      const payload: CreateUserResponse = { userId, username, authToken, redirectUrl };
      if (survey.userPersonalIdentifiers)
        payload.name = name;

      if (survey.userCustomFields)
        payload.customFields = customFields;

      return payload;
    }
    catch (err) {
      if (err instanceof ZodError)
        throw err;

      throw new ForbiddenError(err instanceof Error ? err.message : undefined);
    }
  };

  /**
   * User information for survey
   *
   * @param {(string | Survey)} slug
   * @param {string} userId
   * @param {number} tzOffset
   * @param {number} [increment] (increment submission count, e.g. during queued submission, thus not included in stats)
   * @returns {Promise<SurveyUserInfoResponse>}
   */
  const userInfo = async (
    slug: string | Survey,
    userId: string,
    tzOffset: number,
    increment = 0,
  ): Promise<SurveyUserInfoResponse> => {
    const survey
      = typeof slug === 'string'
        ? await Survey.findBySlug(slug, {
          attributes: [
            'id',
            'feedbackSchemeId',
            'maximumTotalSubmissions',
            'maximumDailySubmissions',
            'numberOfSubmissionsForFeedback',
          ],
        })
        : slug;
    if (!survey)
      throw new NotFoundError();

    const {
      id: surveyId,
      feedbackSchemeId,
      maximumTotalSubmissions,
      maximumDailySubmissions,
      numberOfSubmissionsForFeedback,
    } = survey;

    const user = await User.findByPk(userId, { attributes: ['id', 'name'] });
    if (!user)
      throw new NotFoundError();
    const { name } = user;

    const clientStartOfDay = addMinutes(startOfDay(new Date()), tzOffset * -1);
    const clientEndOfDay = addDays(clientStartOfDay, 1);

    let [totalSubmissions, daySubmissions] = await Promise.all([
      SurveySubmission.count({ where: { surveyId, userId } }),
      SurveySubmission.count({
        where: {
          surveyId,
          userId,
          submissionTime: { [Op.gte]: clientStartOfDay, [Op.lt]: clientEndOfDay },
        },
      }),
    ]);

    if (increment) {
      totalSubmissions = totalSubmissions + increment;
      daySubmissions = daySubmissions + increment;
    }

    return {
      userId,
      name,
      submissions: totalSubmissions,
      showFeedback: !!(feedbackSchemeId && totalSubmissions >= numberOfSubmissionsForFeedback),
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
    const survey = await Survey.findBySlug(slug, {
      attributes: ['id', 'session'],
    });
    if (!survey)
      throw new NotFoundError();

    const { id: surveyId, session } = survey;

    if (!session.store)
      throw new ForbiddenError();

    const userSession = await UserSurveySession.findOne({ where: { userId, surveyId } });
    if (!userSession?.sessionData.startTime) {
      await userSession?.destroy();
      throw new NotFoundError();
    }

    const startTime = new Date(userSession.sessionData.startTime);

    if (!isSessionAgeValid(session.age, startTime) || !isSessionFixedPeriodValid(session.fixed, startTime)) {
      await userSession.destroy();
      throw new NotFoundError();
    }

    return userSession;
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
    sessionData: SurveyState,
  ): Promise<UserSurveySession> => {
    const survey = await Survey.findBySlug(slug, {
      attributes: ['id', 'notifications', 'session'],
    });
    if (!survey)
      throw new NotFoundError();

    const { id: surveyId, session } = survey;

    if (!session.store)
      throw new ForbiddenError();

    const [userSession] = await UserSurveySession.upsert(
      { id: sessionData.uxSessionId, userId, surveyId, sessionData },
      {
        fields: ['id', 'sessionData'],
        // @ts-expect-error sequelize incorrectly handles camelCase vs snake_case
        conflictFields: ['survey_id', 'user_id'],
      },
    );

    /*
     * Sequelize upsert doesn't return info about whether the record was inserted or updated
     * - second tuple element always returns null
     * - hackish timestamps comparison to determine if the record was inserted
     */
    if (
      userSession.createdAt.getTime() === userSession.updatedAt.getTime()
      && survey.notifications.length
      && survey.notifications.some(({ type }) => type === 'survey.session.started')
    ) {
      await scheduler.jobs.addJob({
        type: 'SurveyEventNotification',
        userId,
        params: {
          type: 'survey.session.started',
          sessionId: sessionData.uxSessionId,
          surveyId,
          userId,
        },
      });
    }

    return userSession;
  };

  /**
   * Clear user survey session data
   *
   * @param {string} slug
   * @param {string} userId
   * @returns {Promise<void>}
   */
  const clearSession = async (slug: string, userId: string): Promise<void> => {
    const survey = await Survey.findBySlug(slug, { attributes: ['id', 'notifications'] });
    if (!survey)
      throw new NotFoundError();

    const session = await UserSurveySession.findOne({ where: { userId, surveyId: survey.id } });
    if (!session)
      throw new NotFoundError();

    const {
      id: sessionId,
      sessionData: { submissionTime },
    } = session;
    await session.destroy();

    if (
      submissionTime
      || !survey.notifications.length
      || !survey.notifications.some(({ type }) => type === 'survey.session.cancelled')
    ) {
      return;
    }

    await scheduler.jobs.addJob({
      type: 'SurveyEventNotification',
      userId,
      params: { type: 'survey.session.cancelled', sessionId, surveyId: survey.id, userId },
    });
  };

  /**
   * Get user's submissions
   *
   * @param {SubmissionScope} scopeOptions
   * @param {FindOptions} [options]
   * @returns {Promise<SurveySubmission[]>}
   */
  const getSubmissions = async (
    scopeOptions: SubmissionScope,
    options: FindOptions = {},
  ): Promise<SurveySubmission[]> =>
    SurveySubmission.findAll(submissionScope(scopeOptions, options));

  /**
   * Resolve follow-up URL, if any
   *
   * @param {Survey} survey
   * @param {string} userId
   * @returns {(Promise<string | null | Record<string, string>>)}
   */
  const getFollowUpUrl = async (
    survey: Survey,
    userId: string,
  ): Promise<string | null | Record<string, string>> => {
    const { id: surveyId, surveyScheme } = survey;
    if (!surveyScheme)
      throw new NotFoundError();

    const redirectPrompts = surveyScheme.prompts.submission.filter(
      (prompt): prompt is Prompts['redirect-prompt'] => prompt.component === 'redirect-prompt',
    );
    if (!redirectPrompts.length)
      return null;

    const identifiers = redirectPrompts.map(({ identifier }) => identifier);

    const include: Includeable[] = [
      { association: 'aliases', where: { surveyId }, required: false },
      { association: 'customFields', where: { name: identifiers }, required: false },
    ];

    const user = await User.findByPk(userId, { attributes: ['id'], include });
    if (!user)
      throw new NotFoundError();

    const { aliases = [], customFields = [] } = user;

    const size = redirectPrompts.length;
    if (!size)
      return null;

    const urls = redirectPrompts.reduce<string | null | Record<string, string>>(
      (acc, { id, identifier, url }) => {
        let identifierValue: string | null;
        switch (identifier) {
          case 'userId':
            identifierValue = user.id;
            break;
          case 'username':
          case 'urlAuthToken':
            identifierValue = aliases.length ? aliases[0][identifier] : null;
            break;
          default:
            identifierValue = customFields.length ? customFields[0].value : null;
            break;
        }

        if (!identifierValue || !url)
          return acc;

        if (size > 1 && acc && typeof acc !== 'string') {
          try {
            acc[id] = new URL(url.replace('{identifier}', identifierValue)).href;
          }
          catch (err) {
            logger.error('Invalid follow-up URL', { err });
          }
          return acc;
        }
        else {
          try {
            return new URL(url.replace('{identifier}', identifierValue)).href;
          }
          catch (err) {
            logger.error('Invalid follow-up URL', { err });
            return null;
          }
        }
      },
      size === 1 ? null : {},
    );

    return urls;
  };

  const followUp = async (
    slug: string,
    userId: string,
    tzOffset: number,
  ): Promise<SurveyUserInfoResponse> => {
    const survey = await Survey.findBySlug(slug, {
      attributes: [
        'id',
        'feedbackSchemeId',
        'maximumTotalSubmissions',
        'maximumDailySubmissions',
        'numberOfSubmissionsForFeedback',
      ],
      include: [{ association: 'surveyScheme', attributes: ['prompts'], required: true }],
    });
    if (!survey)
      throw new NotFoundError();

    const [followUpUrl, showFeedback] = await Promise.all([
      getFollowUpUrl(survey, userId),
      userInfo(survey, userId, tzOffset),
    ]);

    return { ...showFeedback, followUpUrl };
  };

  const requestHelp = async (params: JobParams['SurveyHelpRequestNotification']) => {
    const { userId } = params;

    await scheduler.jobs.addJob({ type: 'SurveyHelpRequestNotification', userId, params });
  };

  const storeRating = async (slug: string, userId: string, payload: SurveyRatingRequest) => {
    const survey = await Survey.findBySlug(slug, { attributes: ['id'] });
    if (!survey)
      throw new NotFoundError();

    return UserSurveyRating.create({ surveyId: survey.id, userId, ...payload });
  };

  const getSearchSettings = async (slug: string) => {
    const survey = await Survey.findBySlug(slug, { attributes: ['searchSettings'], include: ['locale'] });
    if (!survey || !survey.locale)
      throw new NotFoundError();

    return {
      searchSettings: survey.searchSettings,
      localeCode: survey.locale.code,
    };
  };

  return {
    generateRespondent,
    createRespondentWithJWT,
    userInfo,
    getSession,
    setSession,
    clearSession,
    getSubmissions,
    getFollowUpUrl,
    followUp,
    requestHelp,
    storeRating,
    getSearchSettings,
  };
}

export default surveyService;

export type SurveyService = ReturnType<typeof surveyService>;
