import type { Request, Response } from 'express';
import type {
  PublicSurveyEntryResponse,
  PublicSurveyListResponse,
  GenerateUserResponse,
} from '@intake24/common/types/http';
import { Survey } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import type { RespondentFromJWT } from '@intake24/api/services';
import type { Controller } from './controller';

export type SurveyController = Controller<'browse' | 'entry' | 'generateUser' | 'createUser'>;

export default ({ surveyService }: Pick<IoC, 'surveyService'>): SurveyController => {
  const browse = async (req: Request, res: Response<PublicSurveyListResponse[]>): Promise<void> => {
    const surveys = await Survey.findAll({ attributes: ['id', 'name', 'localeId'] });

    res.json(surveys);
  };

  const entry = async (
    req: Request<{ surveyId: string }>,
    res: Response<PublicSurveyEntryResponse>
  ): Promise<void> => {
    const { surveyId } = req.params;

    const survey = await Survey.findByPk(surveyId, {
      attributes: ['id', 'name', 'localeId', 'originatingUrl', 'supportEmail'],
    });
    if (!survey) throw new NotFoundError();

    res.json(survey);
  };

  const generateUser = async (
    req: Request<{ surveyId: string }>,
    res: Response<GenerateUserResponse>
  ): Promise<void> => {
    const { surveyId } = req.params;

    const {
      respondent: { userName },
      password,
    } = await surveyService.generateRespondent(surveyId);

    res.json({ userName, password });
  };

  const createUser = async (
    req: Request<{ surveyId: string }, any, any, { params: string }>,
    res: Response<RespondentFromJWT>
  ): Promise<void> => {
    const {
      params: { surveyId },
      query: { params },
    } = req;

    const data = await surveyService.createRespondentWithJWT(surveyId, params);

    res.json(data);
  };

  return {
    browse,
    entry,
    generateUser,
    createUser,
  };
};
