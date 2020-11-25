import { Request, Response } from 'express';
import { Survey, SurveySubmission, User } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import surveySvc from '@/services/survey.service';

export default {
  async list(req: Request, res: Response): Promise<void> {
    const surveys = await Survey.scope('public').findAll();

    res.json(surveys);
  },

  async entry(req: Request, res: Response): Promise<void> {
    const { surveyId } = req.params;
    const survey = await Survey.scope('public').findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    res.json(survey);
  },

  async parameters(req: Request, res: Response): Promise<void> {
    const { surveyId } = req.params;
    const survey = await Survey.scope(['respondent', 'scheme']).findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    res.json(survey);
  },

  /*
   * TODO:
   * - Review for V4 frontend - include user data - submissions, feedback data etc for user's dashboard?
   * - Implement submission limits
   *
   */
  async userInfo(req: Request, res: Response): Promise<void> {
    const { surveyId } = req.params;
    const { tz } = req.query;
    const { id: userId, name } = req.user as User;

    const survey = await Survey.findByPk(surveyId);
    const submissions = await SurveySubmission.count({ where: { surveyId, userId } });

    if (!survey) throw new NotFoundError();

    const userInfo = {
      userId,
      name,
      recallNumber: submissions + 1,
      redirectToFeedback: submissions >= survey.numberOfSubmissionsForFeedback,
      maximumTotalSubmissionsReached: false,
      maximumDailySubmissionsReached: false,
    };

    res.json(userInfo);
  },

  async generateUser(req: Request, res: Response): Promise<void> {
    const { surveyId } = req.params;

    const {
      respondent: { userName },
      password,
    } = await surveySvc.generateRespondent(surveyId);

    res.json({ userName, password });
  },

  // TODO: implement
  async createUser(req: Request, res: Response): Promise<void> {
    const { surveyId } = req.params;

    res.json();
  },

  // TODO: implement
  async requestHelp(req: Request, res: Response): Promise<void> {
    const { surveyId } = req.params;

    res.json();
  },

  // TODO: implement
  async submission(req: Request, res: Response): Promise<void> {
    const { surveyId } = req.params;

    res.json();
  },

  /*
   * TODO:
   * - Review if this is needed for V4, clarification needed
   * - Feedback will probably be component of Survey app
   * - We will only need some user/survey info, which can be included comes from above "parameters" & "user-info" endpoints
   */
  async followUp(req: Request, res: Response): Promise<void> {
    const { surveyId } = req.params;

    res.json();
  },
};
