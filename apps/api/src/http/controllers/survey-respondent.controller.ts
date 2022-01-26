import { Request, Response } from 'express';
import {
  SurveyEntryResponse,
  SurveyFollowUpResponse,
  SurveyUserInfoResponse,
  SurveyUserSessionResponse,
} from '@intake24/common/types/http';
import { flattenSchemeWithSection, isMealSection } from '@intake24/common/schemes';
import { merge } from '@intake24/common/util';
import { Survey, User, Scheme, FeedbackScheme } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
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

    const survey = await Survey.findByPk(surveyId, {
      include: [{ model: Scheme }, { model: FeedbackScheme }],
    });
    if (!survey || !survey.scheme) throw new NotFoundError();

    const {
      id,
      name,
      state,
      localeId,
      scheme,
      feedbackScheme,
      numberOfSubmissionsForFeedback,
      storeUserSessionOnServer,
      suspensionReason,
      overrides,
    } = survey;

    let { meals } = scheme;
    const { questions } = scheme;

    // Merge survey's scheme overrides
    // 1) Meals - override whole list
    if (overrides.meals.length) meals = [...overrides.meals];

    // 2) Questions - merge by Question ID
    if (overrides.questions.length) {
      const flattenScheme = flattenSchemeWithSection(scheme.questions);
      for (const question of overrides.questions) {
        const match = flattenScheme.find((item) => item.id === question.id);
        if (!match) continue;

        const { section } = match;

        if (isMealSection(section)) {
          const index = questions.meals[section].findIndex((item) => item.id === question.id);
          if (index !== -1) questions.meals[section].splice(index, 1, merge(match, question));
        } else {
          const index = questions[section].findIndex((item) => item.id === question.id);
          if (index !== -1) questions[section].splice(index, 1, merge(match, question));
        }
      }
    }

    res.json({
      id,
      name,
      state,
      localeId,
      scheme: { id: scheme.id, type: scheme.type, meals, questions },
      feedbackScheme,
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
