import { Request, Response } from 'express';
import { Survey, SurveySubmission, User } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import type { IoC } from '@/ioc';
import {
  PublicSurveyEntryResponse,
  PublicSurveyListResponse,
  SurveyEntryResponse,
  SurveyUserInfoResponse,
  GenerateUserResponse,
} from '@common/types/http';
import { Controller } from './controller';

export type SurveyController = Controller<
  | 'browse'
  | 'entry'
  | 'parameters'
  | 'userInfo'
  | 'generateUser'
  | 'createUser'
  | 'requestHelp'
  | 'submissions'
  | 'followUp'
>;

export default ({ surveyService }: Pick<IoC, 'surveyService'>): SurveyController => {
  const browse = async (req: Request, res: Response<PublicSurveyListResponse[]>): Promise<void> => {
    const surveys = await Survey.findAll();

    const data = surveys.map((survey) => ({
      id: survey.id,
      name: survey.name,
      localeId: survey.localeId,
    }));

    res.json(data);
  };

  const entry = async (req: Request, res: Response<PublicSurveyEntryResponse>): Promise<void> => {
    const { surveyId } = req.params;
    const survey = await Survey.findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    const { id, name, localeId, originatingUrl, supportEmail } = survey;

    res.json({ id, name, localeId, originatingUrl, supportEmail });
  };

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
    const submissions = await SurveySubmission.count({ where: { surveyId, userId } });

    if (!survey) throw new NotFoundError();

    res.json({
      userId,
      name,
      recallNumber: submissions + 1,
      redirectToFeedback: submissions >= survey.numberOfSubmissionsForFeedback,
      maximumTotalSubmissionsReached: false,
      maximumDailySubmissionsReached: false,
    });
  };

  const generateUser = async (req: Request, res: Response<GenerateUserResponse>): Promise<void> => {
    const { surveyId } = req.params;

    const {
      respondent: { userName },
      password,
    } = await surveyService.generateRespondent(surveyId);

    res.json({ userName, password });
  };

  // TODO: implement
  const createUser = async (req: Request, res: Response): Promise<void> => {
    const { surveyId } = req.params;

    res.json();
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

    surveyService.submit(surveyId, userId, submission);

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

  return {
    browse,
    entry,
    parameters,
    userInfo,
    generateUser,
    createUser,
    requestHelp,
    submissions,
    followUp,
  };
};
