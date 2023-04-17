import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type {
  JobEntry,
  SurveyRespondentEntry,
  SurveyRespondentsResponse,
} from '@intake24/common/types/http/admin';
import type { PaginateQuery, User } from '@intake24/db';
import { NotFoundError, ValidationError } from '@intake24/api/http/errors';
import { respondentResponse } from '@intake24/api/http/responses/admin';
import { Survey, UserSurveyAlias } from '@intake24/db';

import { getAndCheckAccess } from '../securable.controller';

const adminSurveyRespondentController = ({
  appConfig,
  adminSurveyService,
  feedbackService,
  scheduler,
}: Pick<IoC, 'appConfig' | 'adminSurveyService' | 'feedbackService' | 'scheduler'>) => {
  const entry = async (
    req: Request<{ surveyId: string; userId: string }>,
    res: Response<SurveyRespondentEntry>
  ): Promise<void> => {
    const {
      id: surveyId,
      slug,
      authUrlDomainOverride,
    } = await getAndCheckAccess(Survey, 'respondents', req);
    const { userId } = req.params;

    const respondent = await UserSurveyAlias.findOne({
      where: { userId, surveyId },
      include: [{ association: 'user', include: [{ association: 'customFields' }] }],
    });
    if (!respondent) throw new NotFoundError();

    const respondentRes = respondentResponse(appConfig.urls, slug, authUrlDomainOverride);

    res.json(respondentRes.entry(respondent));
  };

  const browse = async (
    req: Request<{ surveyId: string }, any, any, PaginateQuery>,
    res: Response<SurveyRespondentsResponse>
  ): Promise<void> => {
    const {
      id: surveyId,
      slug,
      authUrlDomainOverride,
    } = await getAndCheckAccess(Survey, 'respondents', req as Request<{ surveyId: string }>);

    const respondentRes = respondentResponse(appConfig.urls, slug, authUrlDomainOverride);

    const respondents = await UserSurveyAlias.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['username'],
      where: { surveyId },
      order: [['username', 'ASC']],
      transform: respondentRes.list,
    });

    res.json(respondents);
  };

  const store = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyRespondentEntry>
  ): Promise<void> => {
    const {
      id: surveyId,
      slug,
      authUrlDomainOverride,
    } = await getAndCheckAccess(Survey, 'respondents', req);

    const respondent = await adminSurveyService.createRespondent(
      surveyId,
      pick(req.body, ['name', 'email', 'phone', 'username', 'password', 'customFields'])
    );

    await respondent.reload({
      include: [{ association: 'user', include: [{ association: 'customFields' }] }],
    });

    const respondentRes = respondentResponse(appConfig.urls, slug, authUrlDomainOverride);

    res.status(201).json(respondentRes.entry(respondent));
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
    const {
      id: surveyId,
      slug,
      authUrlDomainOverride,
    } = await getAndCheckAccess(Survey, 'respondents', req);
    const { userId } = req.params;

    const respondent = await adminSurveyService.updateRespondent(
      surveyId,
      userId,
      pick(req.body, ['name', 'email', 'phone', 'username', 'password', 'customFields'])
    );

    await respondent.reload({
      include: [{ association: 'user', include: [{ association: 'customFields' }] }],
    });

    const respondentRes = respondentResponse(appConfig.urls, slug, authUrlDomainOverride);

    res.json(respondentRes.entry(respondent));
  };

  const destroy = async (
    req: Request<{ surveyId: string; userId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { id: surveyId } = await getAndCheckAccess(Survey, 'respondents', req);
    const { userId } = req.params;

    await adminSurveyService.deleteRespondent(surveyId, userId);

    res.status(204).json();
  };

  const upload = async (
    req: Request<{ surveyId: string }>,
    res: Response<JobEntry>
  ): Promise<void> => {
    const { id: surveyId } = await getAndCheckAccess(Survey, 'respondents', req);

    const { file } = req;
    const { id: userId } = req.user as User;

    if (!file) throw new ValidationError('File not found.', { path: 'file' });

    const job = await adminSurveyService.importRespondents(surveyId, userId, file);

    res.json(job);
  };

  const exportAuthUrls = async (
    req: Request<{ surveyId: string }>,
    res: Response<JobEntry>
  ): Promise<void> => {
    const { id: surveyId } = await getAndCheckAccess(Survey, 'respondents', req);
    const { id: userId } = req.user as User;

    const job = await adminSurveyService.exportAuthenticationUrls(surveyId, userId);

    res.json(job);
  };

  const downloadFeedback = async (
    req: Request<{ surveyId: string; userId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { id: surveyId } = await getAndCheckAccess(Survey, 'respondents', req);
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
    const { id: surveyId } = await getAndCheckAccess(Survey, 'respondents', req);

    const {
      params: { userId },
      body: { email, copy },
    } = req;
    const user = req.user as User;

    await scheduler.jobs.addJob({
      type: 'SurveyFeedbackNotification',
      userId,
      params: {
        surveyId,
        userId,
        to: email,
        cc: copy === 'cc' && user.email ? user.email : undefined,
        bcc: copy === 'bcc' && user.email ? user.email : undefined,
      },
    });

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

export default adminSurveyRespondentController;

export type AdminSurveyRespondentController = ReturnType<typeof adminSurveyRespondentController>;
