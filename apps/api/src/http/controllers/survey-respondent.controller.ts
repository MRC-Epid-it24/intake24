import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { Prompt } from '@intake24/common/prompts';
import type { SurveyState as SurveyStatus } from '@intake24/common/surveys';
import type { SurveyState } from '@intake24/common/types';
import type {
  SurveyEntryResponse,
  SurveyRequestHelpInput,
  SurveyUserInfoResponse,
  SurveyUserSessionResponse,
} from '@intake24/common/types/http';
import type { User } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { flattenSchemeWithSection, isMealSection } from '@intake24/common/surveys';
import { merge } from '@intake24/common/util';
import { Survey } from '@intake24/db';

const surveyRespondentController = ({
  surveyService,
  surveySubmissionService,
}: Pick<IoC, 'surveyService' | 'surveySubmissionService'>) => {
  const parameters = async (
    req: Request<{ slug: string }>,
    res: Response<SurveyEntryResponse>
  ): Promise<void> => {
    const { slug } = req.params;

    const survey = await Survey.findOne({
      where: { slug },
      include: [
        { association: 'surveyScheme', attributes: ['id', 'type', 'meals', 'prompts'] },
        {
          association: 'feedbackScheme',
          attributes: [
            'id',
            'cards',
            'demographicGroups',
            'henryCoefficients',
            'meals',
            'outputs',
            'physicalDataFields',
            'sections',
            'topFoods',
            'type',
          ],
        },
        { association: 'locale', attributes: ['id', 'code'] },
      ],
    });
    if (!survey || !survey.locale || !survey.surveyScheme) throw new NotFoundError();

    const {
      id,
      name,
      state: initialState,
      startDate,
      endDate,
      locale,
      surveyScheme,
      feedbackScheme,
      numberOfSubmissionsForFeedback,
      storeUserSessionOnServer,
      suspensionReason,
      surveySchemeOverrides,
      searchSortingAlgorithm,
      searchMatchScoreWeight,
    } = survey;

    let { meals } = surveyScheme;
    const { prompts } = surveyScheme;

    let state: SurveyStatus;
    const today = new Date();
    if (startDate > today) state = 'notStarted';
    else if (endDate < today) state = 'completed';
    else state = initialState;

    // Merge survey's scheme overrides
    // 1) Meals - override whole list
    if (surveySchemeOverrides.meals.length) meals = [...surveySchemeOverrides.meals];

    // 2) Prompts - merge by Prompt ID & Prompt Name
    if (surveySchemeOverrides.prompts.length) {
      const flattenScheme = flattenSchemeWithSection(surveyScheme.prompts);
      for (const prompt of surveySchemeOverrides.prompts) {
        const match = flattenScheme.find(
          (item) => item.id === prompt.id && item.name === prompt.name
        );
        if (!match) continue;

        const { section } = match;

        if (isMealSection(section)) {
          const index = prompts.meals[section].findIndex(
            (item) => item.id === prompt.id && item.name === prompt.name
          );
          if (index !== -1) prompts.meals[section].splice(index, 1, merge<Prompt>(match, prompt));
        } else {
          const index = prompts[section].findIndex(
            (item) => item.id === prompt.id && item.name === prompt.name
          );
          if (index !== -1) prompts[section].splice(index, 1, merge<Prompt>(match, prompt));
        }
      }
    }

    res.json({
      id,
      slug,
      name,
      state,
      locale,
      surveyScheme: { id: surveyScheme.id, type: surveyScheme.type, meals, prompts },
      feedbackScheme,
      numberOfSubmissionsForFeedback,
      storeUserSessionOnServer,
      suspensionReason,
      searchSortingAlgorithm,
      searchMatchScoreWeight,
    });
  };

  const userInfo = async (
    req: Request<{ slug: string }, any, any, { tzOffset: number }>,
    res: Response<SurveyUserInfoResponse>
  ): Promise<void> => {
    const {
      params: { slug },
      query: { tzOffset },
    } = req;
    const user = req.user as User;

    const userResponse = await surveyService.userInfo(slug, user, tzOffset);

    res.json(userResponse);
  };

  const getSession = async (
    req: Request<{ slug: string }>,
    res: Response<SurveyUserSessionResponse>
  ): Promise<void> => {
    const { id: userId } = req.user as User;
    const { slug } = req.params;

    const session = await surveyService.getSession(slug, userId);

    res.json(session);
  };

  const setSession = async (
    req: Request<{ slug: string }>,
    res: Response<SurveyUserSessionResponse>
  ): Promise<void> => {
    const { id: userId } = req.user as User;
    const { slug } = req.params;
    const { sessionData } = req.body;

    const session = await surveyService.setSession(slug, userId, sessionData);

    res.json(session);
  };

  const clearSession = async (
    req: Request<{ slug: string }>,
    res: Response<void>
  ): Promise<void> => {
    const { id: userId } = req.user as User;
    const { slug } = req.params;

    await surveyService.clearSession(slug, userId);

    res.json();
  };

  const requestHelp = async (
    req: Request<{ slug: string }, any, SurveyRequestHelpInput>,
    res: Response<undefined>
  ): Promise<void> => {
    const { id: userId } = req.user as User;
    const { slug: surveySlug } = req.params;
    const { name, email, phone, phoneCountry, message } = req.body;

    await surveyService.requestHelp({
      surveySlug,
      userId,
      name,
      email,
      phone,
      phoneCountry,
      message,
    });

    res.json();
  };

  const submission = async (
    req: Request<{ slug: string }, any, { submission: SurveyState }, { tzOffset: number }>,
    res: Response<SurveyUserInfoResponse>
  ): Promise<void> => {
    const {
      headers: { 'user-agent': userAgent },
      params: { slug },
      query: { tzOffset },
    } = req;
    const user = req.user as User;
    const { submission } = req.body;

    const followUpInfo = await surveySubmissionService.submit(
      slug,
      user,
      { ...submission, userAgent },
      tzOffset
    );

    res.json(followUpInfo);
  };

  return {
    parameters,
    userInfo,
    getSession,
    setSession,
    clearSession,
    requestHelp,
    submission,
  };
};

export default surveyRespondentController;

export type SurveyRespondentController = ReturnType<typeof surveyRespondentController>;
