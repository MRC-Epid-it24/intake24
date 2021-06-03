import { Request, Response } from 'express';
import { Survey, User } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import type { IoC } from '@/ioc';
import {
  SurveyEntryResponse,
  SurveyFollowUpResponse,
  SurveyUserInfoResponse,
  SurveyUserSessionResponse,
} from '@common/types/http';
import { Controller } from './controller';

export type SurveyRespondentController = Controller<
  | 'parameters'
  | 'userInfo'
  | 'getSession'
  | 'setSession'
  | 'requestHelp'
  | 'submissions'
  | 'followUp'
>;

export default ({ surveyService }: Pick<IoC, 'surveyService'>): SurveyRespondentController => {
  const parameters = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyEntryResponse>
  ): Promise<void> => {
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

  const userInfo = async (
    req: Request<{ surveyId: string }, any, any, { tzOffset: number }>,
    res: Response<SurveyUserInfoResponse>
  ): Promise<void> => {
    const {
      params: { surveyId },
      query: { tzOffset },
    } = req;
    const user = req.user as User;

    const userResponse = await surveyService.userInfo(surveyId, user, tzOffset);

    res.json(userResponse);
  };

  const getSession = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyUserSessionResponse>
  ): Promise<void> => {
    const { id: userId } = req.user as User;
    const { surveyId } = req.params;

    const session = await surveyService.getSession(surveyId, userId);

    res.json(session);
  };

  const setSession = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyUserSessionResponse>
  ): Promise<void> => {
    const { id: userId } = req.user as User;
    const { surveyId } = req.params;
    const { sessionData } = req.body;

    const session = await surveyService.setSession(surveyId, userId, sessionData);

    res.json(session);
  };

  // TODO: implement
  const requestHelp = async (req: Request<{ surveyId: string }>, res: Response): Promise<void> => {
    // const { surveyId } = req.params;

    res.json();
  };

  const submissions = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyFollowUpResponse>
  ): Promise<void> => {
    const { surveyId } = req.params;
    const { id: userId } = req.user as User;
    const { submission } = req.body;

    const followUpInfo = await surveyService.submit(surveyId, userId, submission);

    res.json(followUpInfo);
  };

  const followUp = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyFollowUpResponse>
  ): Promise<void> => {
    const { surveyId } = req.params;
    const { id: userId } = req.user as User;

    const followUpInfo = await surveyService.followUp(surveyId, userId);

    res.json(followUpInfo);
  };

  return {
    parameters,
    userInfo,
    getSession,
    setSession,
    requestHelp,
    submissions,
    followUp,
  };
};
