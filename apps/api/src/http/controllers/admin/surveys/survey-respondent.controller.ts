import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { Subject } from '@intake24/common/security';
import type {
  JobEntry,
  SurveyRespondentEntry,
  SurveyRespondentsResponse,
} from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { NotFoundError, ValidationError } from '@intake24/api/http/errors';
import { respondentResponse } from '@intake24/api/http/responses/admin';
import { atob } from '@intake24/api/util';
import { Survey, UserSurveyAlias } from '@intake24/db';

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
    const { surveyId, userId } = req.params;
    const { aclService } = req.scope.cradle;

    const { slug, authUrlDomainOverride } = await aclService.findAndCheckRecordAccess(
      Survey,
      'respondents',
      { attributes: ['id', 'slug', 'authUrlDomainOverride'], where: { id: surveyId } }
    );

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
    const { surveyId } = req.params;
    const { aclService } = req.scope.cradle;

    const { slug, authUrlDomainOverride } = await aclService.findAndCheckRecordAccess(
      Survey,
      'respondents',
      { attributes: ['id', 'slug', 'authUrlDomainOverride'], where: { id: surveyId } }
    );

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
    const { surveyId } = req.params;
    const { aclService } = req.scope.cradle;

    const { slug, authUrlDomainOverride } = await aclService.findAndCheckRecordAccess(
      Survey,
      'respondents',
      { attributes: ['id', 'slug', 'authUrlDomainOverride'], where: { id: surveyId } }
    );

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
    const { surveyId, userId } = req.params;
    const { aclService } = req.scope.cradle;

    const { slug, authUrlDomainOverride } = await aclService.findAndCheckRecordAccess(
      Survey,
      'respondents',
      { attributes: ['id', 'slug', 'authUrlDomainOverride'], where: { id: surveyId } }
    );

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
    const { surveyId, userId } = req.params;
    const { aclService } = req.scope.cradle;

    await aclService.findAndCheckRecordAccess(Survey, 'respondents', {
      attributes: ['id'],
      where: { id: surveyId },
    });

    await adminSurveyService.deleteRespondent(surveyId, userId);

    res.status(204).json();
  };

  const upload = async (
    req: Request<{ surveyId: string }>,
    res: Response<JobEntry>
  ): Promise<void> => {
    const { surveyId } = req.params;
    const {
      aclService,
      user: { userId },
    } = req.scope.cradle;

    await aclService.findAndCheckRecordAccess(Survey, 'respondents', {
      attributes: ['id'],
      where: { id: surveyId },
    });

    const { file } = req;

    if (!file) throw new ValidationError('File not found.', { path: 'file' });

    const job = await adminSurveyService.importRespondents(surveyId, userId, file);

    res.json(job);
  };

  const exportAuthUrls = async (
    req: Request<{ surveyId: string }>,
    res: Response<JobEntry>
  ): Promise<void> => {
    const { surveyId } = req.params;
    const {
      aclService,
      user: { userId },
    } = req.scope.cradle;

    await aclService.findAndCheckRecordAccess(Survey, 'respondents', {
      attributes: ['id'],
      where: { id: surveyId },
    });

    const job = await adminSurveyService.exportAuthenticationUrls(surveyId, userId);

    res.json(job);
  };

  const downloadFeedback = async (
    req: Request<{ surveyId: string; userId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { surveyId, userId } = req.params;
    const { aclService } = req.scope.cradle;

    await aclService.findAndCheckRecordAccess(Survey, 'respondents', {
      attributes: ['id'],
      where: { id: surveyId },
    });

    const { pdfStream, filename } = await feedbackService.getFeedbackStream(surveyId, userId);

    res.set('content-type', 'application/pdf');
    res.set('content-disposition', `attachment; filename=${filename}`);

    pdfStream.pipe(res);
  };

  const emailFeedback = async (
    req: Request<{ surveyId: string; userId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const {
      params: { surveyId, userId },
      body: { email, copy },
    } = req;
    const { aclService } = req.scope.cradle;

    await aclService.findAndCheckRecordAccess(Survey, 'respondents', {
      attributes: ['id'],
      where: { id: surveyId },
    });

    const subject = atob<Subject>(req.scope.cradle.user.sub);
    const userEmail = subject.provider === 'email' ? subject.providerKey : undefined;

    await scheduler.jobs.addJob({
      type: 'SurveyFeedbackNotification',
      userId,
      params: {
        surveyId,
        userId,
        to: email,
        cc: copy === 'cc' && userEmail ? userEmail : undefined,
        bcc: copy === 'bcc' && userEmail ? userEmail : undefined,
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
