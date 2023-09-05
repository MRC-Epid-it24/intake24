import { URL } from 'node:url';

import { addDays, addMinutes, startOfDay } from 'date-fns';
import ms from 'ms';

import type { IoC } from '@intake24/api/ioc';
import type { Prompts } from '@intake24/common/prompts';
import type { JobParams, SurveyState } from '@intake24/common/types';
import type { CreateUserResponse, SurveyUserInfoResponse } from '@intake24/common/types/http';
import type { FindOptions, Includeable, SubmissionScope } from '@intake24/db';
import { ApplicationError, ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import { jwt } from '@intake24/api/util';
import { randomString } from '@intake24/common/util';
import {
  GenUserCounter,
  Op,
  submissionScope,
  Survey,
  SurveySubmission,
  User,
  UserSurveyAlias,
  UserSurveySession,
} from '@intake24/db';

export type RespondentWithPassword = {
  respondent: UserSurveyAlias;
  password: string;
};

const surveyService = ({
  adminSurveyService,
  logger: globalLogger,
  scheduler,
}: Pick<IoC, 'adminSurveyService' | 'logger' | 'scheduler'>) => {
  const logger = globalLogger.child({ service: 'SurveyService' });

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
   * @param {string} token
   * @returns {Promise<CreateUserResponse>}
   */
  const createRespondentWithJWT = async (
    slug: string,
    token: string
  ): Promise<CreateUserResponse> => {
    const survey = await Survey.findOne({ where: { slug } });
    if (!survey) throw new NotFoundError();

    const { id: surveyId, allowGenUsers, genUserKey } = survey;

    if (!allowGenUsers || !genUserKey)
      throw new ForbiddenError(`Survey doesn't support user generation`);

    let decoded;

    try {
      decoded = await jwt.verify(token, genUserKey, { algorithms: ['HS256', 'HS512'] });
    } catch (err) {
      throw new ForbiddenError(err instanceof Error ? err.message : undefined);
    }

    if (!decoded || Object.prototype.toString.call(decoded) !== '[object Object]')
      throw new ApplicationError('Malformed token payload');

    const { username, redirectUrl } = decoded;
    if (!username || typeof username !== 'string')
      throw new ApplicationError('Invalid claim: missing username');
    if (typeof redirectUrl !== 'undefined' && typeof redirectUrl !== 'string')
      throw new ApplicationError('Invalid claim: redirectUrl must a string');

    const alias = await UserSurveyAlias.findOne({ where: { surveyId, username } });
    if (alias) {
      const { userId, urlAuthToken: authToken } = alias;

      return { userId, username, authToken, redirectUrl };
    }

    const { userId, urlAuthToken: authToken } = await adminSurveyService.createRespondent(survey, {
      username,
      password: randomString(12),
    });

    return { userId, username, authToken, redirectUrl };
  };

  /**
   * User information for survey
   *
   * @param {(string | Survey)} slug
   * @param {User} user
   * @param {number} tzOffset
   * @param {number} [increment=0] (increment submission count, e.g. during queued submission, thus not included in stats)
   * @returns {Promise<SurveyUserInfoResponse>}
   */
  const userInfo = async (
    slug: string | Survey,
    user: User,
    tzOffset: number,
    increment = 0
  ): Promise<SurveyUserInfoResponse> => {
    const survey = typeof slug === 'string' ? await Survey.findOne({ where: { slug } }) : slug;
    if (!survey) throw new NotFoundError();

    const {
      id: surveyId,
      feedbackSchemeId,
      maximumTotalSubmissions,
      maximumDailySubmissions,
    } = survey;
    const { id: userId, name } = user;

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
      showFeedback: !!(
        feedbackSchemeId && totalSubmissions >= survey.numberOfSubmissionsForFeedback
      ),
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

    // TODO: should be configurable in scheme / survey settings
    const expiredAt = new Date(Date.now() - ms('12h'));
    if (session.updatedAt < expiredAt) {
      await session.destroy();
      throw new NotFoundError();
    }

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
   * Clear user survey session data
   *
   * @param {string} slug
   * @param {string} userId
   * @returns {Promise<void>}
   */
  const clearSession = async (slug: string, userId: string): Promise<void> => {
    const survey = await Survey.findOne({ where: { slug } });
    if (!survey) throw new NotFoundError();

    await UserSurveySession.destroy({ where: { surveyId: survey.id, userId } });
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

    const redirectPrompt = surveyScheme.prompts.submission.find(
      (prompt) => prompt.component === 'redirect-prompt'
    );
    if (!redirectPrompt) return null;

    const { identifier, url } = redirectPrompt as Prompts['redirect-prompt'];

    const include: Includeable[] = [
      { association: 'aliases', where: { surveyId }, required: false },
    ];
    if (identifier)
      include.push({ association: 'customFields', where: { name: identifier }, required: false });

    const user = await User.findByPk(userId, { include });

    if (!user) throw new NotFoundError();
    const { aliases = [], customFields = [] } = user;

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

    if (!identifierValue || !url) return null;

    try {
      return new URL(url.replace('{identifier}', identifierValue)).href;
    } catch (err) {
      logger.error('Invalid follow-up URL', { err });
      return null;
    }
  };

  const followUp = async (
    slug: string,
    user: User,
    tzOffset: number
  ): Promise<SurveyUserInfoResponse> => {
    const survey = await Survey.findOne({
      where: { slug },
      include: [{ association: 'surveyScheme', required: true }],
    });
    if (!survey || !survey.surveyScheme) throw new NotFoundError();

    const [followUpUrl, showFeedback] = await Promise.all([
      getFollowUpUrl(survey, user.id),
      userInfo(survey, user, tzOffset),
    ]);

    return { ...showFeedback, followUpUrl };
  };

  const requestHelp = async (params: JobParams['SurveyHelpRequestNotification']) => {
    const { userId } = params;

    await scheduler.jobs.addJob({ type: 'SurveyHelpRequestNotification', userId, params });
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
  };
};

export default surveyService;

export type SurveyService = ReturnType<typeof surveyService>;
