import { Request, Response } from 'express';
import {
  PublicSurveyEntryResponse,
  PublicSurveyListResponse,
  GenerateUserResponse,
} from '@common/types/http';
import { Survey } from '@api/db/models/system';
import { NotFoundError } from '@api/http/errors';
import type { IoC } from '@api/ioc';
import { Controller } from './controller';

export type SurveyController = Controller<'browse' | 'entry' | 'generateUser' | 'createUser'>;

export default ({ surveyService }: Pick<IoC, 'surveyService'>): SurveyController => {
  const browse = async (req: Request, res: Response<PublicSurveyListResponse[]>): Promise<void> => {
    const surveys = await Survey.findAll();

    const data = surveys.map(({ id, name, localeId }) => ({ id, name, localeId }));

    res.json(data);
  };

  const entry = async (req: Request, res: Response<PublicSurveyEntryResponse>): Promise<void> => {
    const { surveyId } = req.params;

    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    const { id, name, localeId, originatingUrl, supportEmail } = survey;

    res.json({ id, name, localeId, originatingUrl, supportEmail });
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

  return {
    browse,
    entry,
    generateUser,
    createUser,
  };
};
