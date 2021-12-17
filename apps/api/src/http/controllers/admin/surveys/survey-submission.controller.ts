import { Request, Response } from 'express';
import { pick } from 'lodash';
import { WhereOptions } from 'sequelize';
import { validate } from 'uuid';
import { SurveySubmissionResponse, SurveySubmissionsResponse } from '@common/types/http/admin';
import { SurveySubmissionAttributes } from '@common/types/models';
import { Survey, SurveySubmission } from '@api/db/models/system';
import { submissionScope } from '@api/db/models/system/survey-submission';
import { NotFoundError } from '@api/http/errors';
import { PaginateQuery } from '@api/db/models/model';
import { Controller } from '../../controller';

export type AdminSurveySubmissionController = Controller<'browse' | 'entry' | 'destroy'>;

export default (): AdminSurveySubmissionController => {
  const browse = async (
    req: Request<{ surveyId: string }, any, any, PaginateQuery>,
    res: Response<SurveySubmissionsResponse>
  ): Promise<void> => {
    const {
      params: { surveyId },
      query: { search },
    } = req;

    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    const where: WhereOptions<SurveySubmissionAttributes> = { surveyId };
    if (typeof search === 'string' && search) {
      if (validate(search)) where.id = search;
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
    res: Response<SurveySubmissionResponse>
  ): Promise<void> => {
    const { surveyId, submissionId } = req.params;

    const scope = submissionScope({ surveyId });
    const submission = await SurveySubmission.findOne({
      ...scope,
      where: { ...scope.where, id: submissionId },
    });
    if (!submission) throw new NotFoundError();

    res.json({ data: submission });
  };

  const destroy = async (
    req: Request<{ surveyId: string; submissionId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { surveyId, submissionId } = req.params;

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
