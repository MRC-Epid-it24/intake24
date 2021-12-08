import { Request, Response } from 'express';
import { pick } from 'lodash';
import {
  JobResponse,
  SurveyRespondentResponse,
  SurveyRespondentsResponse,
} from '@common/types/http/admin';
import { Survey, User, UserCustomField, UserSurveyAlias } from '@api/db/models/system';
import { NotFoundError, ValidationError } from '@api/http/errors';
import { userRespondentResponse } from '@api/http/responses/admin';
import type { IoC } from '@api/ioc';
import { Controller, CrudActions } from '../../controller';

export type AdminSurveyRespondentController = Controller<
  Exclude<CrudActions, 'create'> | 'upload' | 'exportAuthUrls'
>;

export default ({
  adminSurveyService,
}: Pick<IoC, 'adminSurveyService'>): AdminSurveyRespondentController => {
  const entry = async (
    req: Request<{ surveyId: string; userId: string }>,
    res: Response<SurveyRespondentResponse>
  ): Promise<void> => {
    const { surveyId, userId } = req.params;

    const respondent = await UserSurveyAlias.findOne({
      where: { userId, surveyId },
      include: [{ model: User, include: [{ model: UserCustomField }] }],
    });
    if (!respondent) throw new NotFoundError();

    res.json({ data: userRespondentResponse(respondent) });
  };

  const browse = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyRespondentsResponse>
  ): Promise<void> => {
    const { surveyId } = req.params;

    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    const respondents = await UserSurveyAlias.paginate({
      req,
      columns: ['userName'],
      where: { surveyId },
      transform: userRespondentResponse,
      order: [['userName', 'ASC']],
    });

    res.json(respondents);
  };

  const store = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyRespondentResponse>
  ): Promise<void> => {
    const { surveyId } = req.params;

    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    const respondent = await adminSurveyService.createRespondent(
      surveyId,
      pick(req.body, ['name', 'email', 'phone', 'userName', 'password', 'customFields'])
    );

    await respondent.reload({
      include: [{ model: User, include: [{ model: UserCustomField }] }],
    });

    res.status(201).json({ data: userRespondentResponse(respondent) });
  };

  const read = async (
    req: Request<{ surveyId: string; userId: string }>,
    res: Response<SurveyRespondentResponse>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ surveyId: string; userId: string }>,
    res: Response<SurveyRespondentResponse>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ surveyId: string; userId: string }>,
    res: Response<SurveyRespondentResponse>
  ): Promise<void> => {
    const { surveyId, userId } = req.params;

    const respondent = await adminSurveyService.updateRespondent(
      surveyId,
      userId,
      pick(req.body, ['name', 'email', 'phone', 'userName', 'password', 'customFields'])
    );

    await respondent.reload({
      include: [{ model: User, include: [{ model: UserCustomField }] }],
    });

    res.json({ data: userRespondentResponse(respondent) });
  };

  const destroy = async (
    req: Request<{ surveyId: string; userId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { surveyId, userId } = req.params;

    await adminSurveyService.deleteRespondent(surveyId, userId);

    res.status(204).json();
  };

  const upload = async (
    req: Request<{ surveyId: string }>,
    res: Response<JobResponse>
  ): Promise<void> => {
    const {
      file,
      params: { surveyId },
    } = req;
    const { id: userId } = req.user as User;

    if (!file) throw new ValidationError('file', 'File not found.');

    const job = await adminSurveyService.importRespondents(surveyId, userId, file);

    res.json({ data: job });
  };

  const exportAuthUrls = async (
    req: Request<{ surveyId: string }>,
    res: Response<JobResponse>
  ): Promise<void> => {
    const { surveyId } = req.params;
    const { id: userId } = req.user as User;

    const job = await adminSurveyService.exportAuthenticationUrls(surveyId, userId);

    res.json({ data: job });
  };

  return {
    browse,
    store,
    read,
    edit,
    update,
    destroy,
    upload,
    exportAuthUrls,
  };
};
