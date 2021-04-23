import { Request, Response } from 'express';
import { Survey, SurveySubmission, User, UserSession } from '@/db/models/system';
import { ForbiddenError, NotFoundError } from '@/http/errors';
import type { IoC } from '@/ioc';
import {
  SurveyEntryResponse,
  SurveyUserInfoResponse,
  SurveyUserSessionResponse,
} from '@common/types/http';
import { Controller } from './controller';

export type SurveyRespondentController = Controller<
  | 'parameters'
  | 'userInfo'
  | 'requestHelp'
  | 'submissions'
  | 'followUp'
  | 'getSession'
  | 'setSession'
>;

export default ({ surveyService }: Pick<IoC, 'surveyService'>): SurveyRespondentController => {
  const parameters = async (req: Request, res: Response<SurveyEntryResponse>): Promise<void> => {
    const { surveyId } = req.params;

    const survey = await Survey.scope('scheme').findByPk(surveyId);
    if (!survey || !survey.scheme) throw new NotFoundError();

    const {
      id,
      name,
      state,
      localeId,
      scheme,
      numberOfSubmissionsForFeedback,
      storeUserSessionOnServer,
      suspensionReason,
    } = survey;

    res.json({
      id,
      name,
      state,
      localeId,
      scheme: {
        id: scheme.id,
        type: scheme.type,
        meals: scheme.meals,
        questions: scheme.questions,
      },
      numberOfSubmissionsForFeedback,
      storeUserSessionOnServer,
      suspensionReason,
    });
  };

  /*
   * TODO:
   * - Review for V4 frontend - include user data - submissions, feedback data etc for user's dashboard?
   * - Implement submission limits
   *
   */
  const userInfo = async (req: Request, res: Response<SurveyUserInfoResponse>): Promise<void> => {
    const { surveyId } = req.params;
    const { tz } = req.query;
    const { id: userId, name } = req.user as User;

    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    const submissions = await SurveySubmission.count({ where: { surveyId, userId } });

    const maximumTotalSubmissionsReached =
      survey.maximumTotalSubmissions !== null && submissions >= survey.maximumTotalSubmissions;

    res.json({
      userId,
      name,
      recallNumber: submissions + 1,
      redirectToFeedback: submissions >= survey.numberOfSubmissionsForFeedback,
      maximumTotalSubmissionsReached,
      maximumDailySubmissionsReached: false,
    });
  };

  // TODO: implement
  const requestHelp = async (req: Request, res: Response): Promise<void> => {
    const { surveyId } = req.params;

    res.json();
  };

  // TODO: implement
  const submissions = async (req: Request, res: Response): Promise<void> => {
    const { surveyId } = req.params;
    const { id: userId } = req.user as User;
    const { submission } = req.body;

    await surveyService.submit(surveyId, userId, submission);

    res.json();
  };

  /*
   * TODO:
   * - Review if this is needed for V4, clarification needed
   * - Feedback will probably be component of Survey app
   * - We will only need some user/survey info, which can be included comes from above "parameters" & "user-info" endpoints
   */
  const followUp = async (req: Request, res: Response): Promise<void> => {
    const { surveyId } = req.params;

    res.json();
  };

  const getSession = async (
    req: Request,
    res: Response<SurveyUserSessionResponse>
  ): Promise<void> => {
    const { id: userId } = req.user as User;
    const { surveyId } = req.params;

    const session = await surveyService.getSession(surveyId, userId);

    res.json(session);
  };

  const setSession = async (
    req: Request,
    res: Response<SurveyUserSessionResponse>
  ): Promise<void> => {
    const { id: userId } = req.user as User;
    const { surveyId } = req.params;
    const { sessionData } = req.body;

    const session = await surveyService.setSession(surveyId, userId, sessionData);

    res.json(session);
  };

  return {
    parameters,
    userInfo,
    requestHelp,
    submissions,
    followUp,
    getSession,
    setSession,
  };
};
