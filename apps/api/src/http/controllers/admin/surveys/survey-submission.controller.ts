import type { Request, Response } from 'express';
import { pick } from 'lodash';
import validator from 'validator';

import type {
  SurveySubmissionEntry,
  SurveySubmissionsResponse,
} from '@intake24/common/types/http/admin';
import type { SurveySubmissionAttributes } from '@intake24/common/types/models';
import type { PaginateQuery, WhereOptions } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { submissionScope, Survey, SurveySubmission } from '@intake24/db';

import { getAndCheckAccess } from '../securable.controller';

const adminSurveySubmissionController = () => {
  const browse = async (
    req: Request<{ surveyId: string }, any, any, PaginateQuery>,
    res: Response<SurveySubmissionsResponse>
  ): Promise<void> => {
    const { id: surveyId } = await getAndCheckAccess(
      Survey,
      'submissions',
      req as Request<{ surveyId: string }>
    );
    const {
      query: { search },
    } = req;

    const where: WhereOptions<SurveySubmissionAttributes> = { surveyId };
    if (typeof search === 'string' && search) {
      if (validator.isUUID(search)) where.id = search;
      else where.userId = search;
    }

    const submissions = await SurveySubmission.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      where,
      order: [['submissionTime', 'DESC']],
    });

    res.json(submissions);
  };

  const entry = async (
    req: Request<{ surveyId: string; submissionId: string }>,
    res: Response<SurveySubmissionEntry>
  ): Promise<void> => {
    const { id: surveyId } = await getAndCheckAccess(Survey, 'submissions', req);
    const { submissionId } = req.params;

    const scope = submissionScope({ surveyId });
    const submission = await SurveySubmission.findOne({
      ...scope,
      where: { ...scope.where, id: submissionId },
    });
    if (!submission) throw new NotFoundError();

    res.json(submission);
  };

  const destroy = async (
    req: Request<{ surveyId: string; submissionId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { id: surveyId } = await getAndCheckAccess(Survey, 'submissions', req);
    const { submissionId } = req.params;

    const submission = await SurveySubmission.findOne({ where: { id: submissionId, surveyId } });
    if (!submission) throw new NotFoundError();

    await submission.destroy();

    res.status(204).json();
  };

  return {
    browse,
    entry,
    destroy,
  };
};

export default adminSurveySubmissionController;

export type AdminSurveySubmissionController = ReturnType<typeof adminSurveySubmissionController>;
