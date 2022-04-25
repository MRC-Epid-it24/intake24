import type { Request, Response } from 'express';
import { pick } from 'lodash';
import type {
  JobEntry,
  SurveyRespondentEntry,
  SurveyRespondentsResponse,
} from '@intake24/common/types/http/admin';
import { User, UserCustomField, UserSurveyAlias, PaginateQuery } from '@intake24/db';
import { NotFoundError, ValidationError } from '@intake24/api/http/errors';
import {
  userRespondentResponse,
  userRespondentListResponse,
} from '@intake24/api/http/responses/admin';
import type { IoC } from '@intake24/api/ioc';
import type { Controller, CrudActions } from '../../controller';
import { getAndCheckSurveyAccess } from './survey.controller';

export type AdminSurveyRespondentController = Controller<
  | Exclude<CrudActions, 'create' | 'refs'>
  | 'upload'
  | 'exportAuthUrls'
  | 'downloadFeedback'
  | 'emailFeedback'
>;

export default ({
  adminSurveyService,
  feedbackService,
  scheduler,
}: Pick<
  IoC,
  'adminSurveyService' | 'feedbackService' | 'scheduler'
>): AdminSurveyRespondentController => {
  const entry = async (
    req: Request<{ surveyId: string; userId: string }>,
    res: Response<SurveyRespondentEntry>
  ): Promise<void> => {
    const { id: surveyId } = await getAndCheckSurveyAccess(req, 'respondents');
    const { userId } = req.params;

    const respondent = await UserSurveyAlias.findOne({
      where: { userId, surveyId },
      include: [{ model: User, include: [{ model: UserCustomField }] }],
    });
    if (!respondent) throw new NotFoundError();

    res.json(userRespondentResponse(respondent));
  };

  const browse = async (
    req: Request<{ surveyId: string }, any, any, PaginateQuery>,
    res: Response<SurveyRespondentsResponse>
  ): Promise<void> => {
    const { id: surveyId } = await getAndCheckSurveyAccess(
      req as Request<{ surveyId: string }>,
      'respondents'
    );

    const respondents = await UserSurveyAlias.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['username'],
      where: { surveyId },
      order: [['username', 'ASC']],
      transform: userRespondentListResponse,
    });

    res.json(respondents);
  };

  const store = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyRespondentEntry>
  ): Promise<void> => {
    const { id: surveyId } = await getAndCheckSurveyAccess(req, 'respondents');

    const respondent = await adminSurveyService.createRespondent(
      surveyId,
      pick(req.body, ['name', 'email', 'phone', 'username', 'password', 'customFields'])
    );

    await respondent.reload({
      include: [{ model: User, include: [{ model: UserCustomField }] }],
    });

    res.status(201).json(userRespondentResponse(respondent));
  };

  const read = async (
    req: Request<{ surveyId: string; userId: string }>,
    res: Response<SurveyRespondentEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ surveyId: string; userId: string }>,
    res: Response<SurveyRespondentEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ surveyId: string; userId: string }>,
    res: Response<SurveyRespondentEntry>
  ): Promise<void> => {
    const { id: surveyId } = await getAndCheckSurveyAccess(req, 'respondents');
    const { userId } = req.params;

    const respondent = await adminSurveyService.updateRespondent(
      surveyId,
      userId,
      pick(req.body, ['name', 'email', 'phone', 'username', 'password', 'customFields'])
    );

    await respondent.reload({
      include: [{ model: User, include: [{ model: UserCustomField }] }],
    });

    res.json(userRespondentResponse(respondent));
  };

  const destroy = async (
    req: Request<{ surveyId: string; userId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { id: surveyId } = await getAndCheckSurveyAccess(req, 'respondents');
    const { userId } = req.params;

    await adminSurveyService.deleteRespondent(surveyId, userId);

    res.status(204).json();
  };

  const upload = async (
    req: Request<{ surveyId: string }>,
    res: Response<JobEntry>
  ): Promise<void> => {
    const { id: surveyId } = await getAndCheckSurveyAccess(req, 'respondents');

    const { file } = req;
    const { id: userId } = req.user as User;

    if (!file) throw new ValidationError('File not found.', { param: 'file' });

    const job = await adminSurveyService.importRespondents(surveyId, userId, file);

    res.json(job);
  };

  const exportAuthUrls = async (
    req: Request<{ surveyId: string }>,
    res: Response<JobEntry>
  ): Promise<void> => {
    const { id: surveyId } = await getAndCheckSurveyAccess(req, 'respondents');
    const { id: userId } = req.user as User;

    const job = await adminSurveyService.exportAuthenticationUrls(surveyId, userId);

    res.json(job);
  };

  const downloadFeedback = async (
    req: Request<{ surveyId: string; userId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { id: surveyId } = await getAndCheckSurveyAccess(req, 'respondents');
    const { userId } = req.params;

    const { pdfStream, filename } = await feedbackService.getFeedbackStream(surveyId, userId);

    res.set('content-type', 'application/pdf');
    res.set('content-disposition', `attachment; filename=${filename}`);

    pdfStream.pipe(res);
  };

  const emailFeedback = async (
    req: Request<{ surveyId: string; userId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { id: surveyId } = await getAndCheckSurveyAccess(req, 'respondents');

    const {
      params: { userId },
      body: { email, copy },
    } = req;
    const user = req.user as User;

    await scheduler.jobs.addJob(
      { type: 'SendRespondentFeedback', userId },
      {
        surveyId,
        userId,
        to: email,
        cc: copy === 'cc' && user.email ? user.email : undefined,
        bcc: copy === 'bcc' && user.email ? user.email : undefined,
      }
    );

    res.json();
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
    downloadFeedback,
    emailFeedback,
  };
};
