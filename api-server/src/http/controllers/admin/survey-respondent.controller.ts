import { Request, Response } from 'express';
import { pick, toInteger } from 'lodash';
import {
  JobResponse,
  SurveyRespondentResponse,
  SurveyRespondentsResponse,
  SurveyRespondentListEntry,
} from '@common/types/http/admin';
import { Survey, User, UserSurveyAlias } from '@/db/models/system';
import { NotFoundError, ValidationError } from '@/http/errors';
import { userRespondentResponse } from '@/http/responses/admin';

import type { IoC } from '@/ioc';
import { Controller } from '../controller';

export type AdminSurveyRespondentController = Controller<
  'browse' | 'store' | 'update' | 'destroy' | 'upload' | 'exportAuthUrls'
>;

export default ({ surveyService }: Pick<IoC, 'surveyService'>): AdminSurveyRespondentController => {
  const browse = async (req: Request, res: Response<SurveyRespondentsResponse>): Promise<void> => {
    const { surveyId } = req.params;
    const survey = await Survey.findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    const respondents = await UserSurveyAlias.paginate<SurveyRespondentListEntry>({
      req,
      columns: ['userName'],
      where: { surveyId },
      include: [{ model: User }],
      transform: userRespondentResponse,
      order: [['userName', 'ASC']],
    });

    res.json(respondents);
  };

  const store = async (req: Request, res: Response<SurveyRespondentResponse>): Promise<void> => {
    const { surveyId } = req.params;

    const respondent = await surveyService.createRespondent(
      surveyId,
      pick(req.body, ['name', 'email', 'phone', 'userName', 'password', 'customFields'])
    );

    res.status(201).json({ data: userRespondentResponse(respondent) });
  };

  const update = async (req: Request, res: Response<SurveyRespondentResponse>): Promise<void> => {
    const { surveyId, userId } = req.params;

    const respondent = await surveyService.updateRespondent(
      surveyId,
      toInteger(userId),
      pick(req.body, ['name', 'email', 'phone', 'userName', 'password', 'customFields'])
    );

    res.json({ data: userRespondentResponse(respondent) });
  };

  const destroy = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { surveyId, userId } = req.params;

    await surveyService.deleteRespondent(surveyId, userId);
    res.status(204).json();
  };

  const upload = async (req: Request, res: Response<JobResponse>): Promise<void> => {
    const {
      file,
      params: { surveyId },
    } = req;
    const { id: userId } = req.user as User;

    if (!file) throw new ValidationError('file', 'File not found.');

    const job = await surveyService.importRespondents(surveyId, userId, file);

    res.json({ data: job });
  };

  const exportAuthUrls = async (req: Request, res: Response<JobResponse>): Promise<void> => {
    const { surveyId } = req.params;
    const { id: userId } = req.user as User;

    const job = await surveyService.exportAuthenticationUrls(surveyId, userId);

    res.json({ data: job });
  };

  return {
    browse,
    store,
    update,
    destroy,
    upload,
    exportAuthUrls,
  };
};
