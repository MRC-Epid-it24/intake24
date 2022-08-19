import { addDays, addMinutes, startOfDay } from 'date-fns';

import type { IoC } from '@intake24/api/ioc';
import type { PromptQuestion, RedirectPromptProps } from '@intake24/common/prompts';
import type { SurveyState } from '@intake24/common/types';
import type { SurveyFollowUpResponse, SurveyUserInfoResponse } from '@intake24/common/types/http';
import type { FindOptions, SubmissionScope } from '@intake24/db';
import { ApplicationError, ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import { jwt } from '@intake24/api/util';
import { randomString } from '@intake24/common/util';
import {
  GenUserCounter,
  Op,
  submissionScope,
  Survey,
  SurveyScheme,
  SurveySubmission,
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

const surveyService = ({ adminSurveyService }: Pick<IoC, 'adminSurveyService'>) => {
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
   * @param {(string | Survey)} slug
   * @param {User} user
   * @param {number} tzOffset
   * @returns {Promise<SurveyUserInfoResponse>}
   */
  const userInfo = async (
    slug: string | Survey,
    user: User,
    tzOffset: number
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

  const followUp = async (
    slug: string,
    user: User,
    tzOffset: number
  ): Promise<SurveyFollowUpResponse> => {
    const survey = await Survey.findOne({
      where: { slug },
      include: [{ model: SurveyScheme, required: true }],
    });
    if (!survey || !survey.surveyScheme) throw new NotFoundError();

    const [followUpUrl, showFeedback] = await Promise.all([
      getFollowUpUrl(survey, user.id),
      userInfo(survey, user, tzOffset),
    ]);

    return { ...showFeedback, followUpUrl };
  };

  return {
    generateRespondent,
    createRespondentWithJWT,
    userInfo,
    getSession,
    setSession,
    getSubmissions,
    getFollowUpUrl,
    followUp,
  };
};

export default surveyService;

export type SurveyService = ReturnType<typeof surveyService>;
