import { Request, Response } from 'express';
import { Survey, SurveySubmission, User } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import type { IoC } from '@/ioc';
import { Controller } from './controller';

export type SurveyController = Controller<
  | 'list'
  | 'entry'
  | 'parameters'
  | 'userInfo'
  | 'generateUser'
  | 'createUser'
  | 'requestHelp'
  | 'submission'
  | 'followUp'
>;

export default ({ surveyService }: IoC): SurveyController => {
  const list = async (req: Request, res: Response): Promise<void> => {
    const surveys = await Survey.scope('public').findAll();

    res.json(surveys);
  };

  const entry = async (req: Request, res: Response): Promise<void> => {
    const { surveyId } = req.params;
    const survey = await Survey.scope('public').findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    res.json(survey);
  };

  const parameters = async (req: Request, res: Response): Promise<void> => {
    const { surveyId } = req.params;
    const survey = await Survey.scope(['respondent', 'scheme']).findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    res.json(survey);
  };

  /*
   * TODO:
   * - Review for V4 frontend - include user data - submissions, feedback data etc for user's dashboard?
   * - Implement submission limits
   *
   */
  const userInfo = async (req: Request, res: Response): Promise<void> => {
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

  const generateUser = async (req: Request, res: Response): Promise<void> => {
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
  const submission = async (req: Request, res: Response): Promise<void> => {
    const { surveyId } = req.params;

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
    list,
    entry,
    parameters,
    userInfo,
    generateUser,
    createUser,
    requestHelp,
    submission,
    followUp,
  };
};
