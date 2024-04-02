import type { Request, Response } from 'express';
import { pick } from 'lodash';
import { isUUID } from 'validator';

import type { IoC } from '@intake24/api/ioc';
import type {
  SurveySubmissionEntry,
  SurveySubmissionsResponse,
} from '@intake24/common/types/http/admin';
import type { PaginateQuery, SurveySubmissionAttributes, WhereOptions } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { Op, submissionScope, Survey, SurveySubmission } from '@intake24/db';

const adminSurveySubmissionController = ({ cache }: Pick<IoC, 'cache'>) => {
  const browse = async (
    req: Request<{ surveyId: string }, any, any, PaginateQuery>,
    res: Response<SurveySubmissionsResponse>
  ): Promise<void> => {
    const {
      params: { surveyId },
      query: { search },
    } = req;
    const { aclService } = req.scope.cradle;

    await aclService.findAndCheckRecordAccess(Survey, 'submissions', {
      attributes: ['id'],
      where: { id: surveyId },
    });

    const where: WhereOptions<SurveySubmissionAttributes> = { surveyId };
    if (typeof search === 'string' && search) {
      if (isUUID(search)) where.id = search;
      else
        where['$user.aliases.username$'] = {
          [SurveySubmission.sequelize?.getDialect() === 'postgres' ? Op.iLike : Op.substring]:
            `%${search}%`,
        };
    }

    const submissions = await SurveySubmission.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      where,
      include: [
        {
          association: 'user',
          attributes: ['id'],
          include: [{ association: 'aliases', attributes: ['username'], where: { surveyId } }],
          required: true,
        },
      ],
      order: [['submissionTime', 'DESC']],
      subQuery: false,
      transform: (submission) => {
        const { user, ...rest } = submission.get();

        return { ...rest, username: user!.aliases![0].username };
      },
    });

    res.json(submissions);
  };

  const entry = async (
    req: Request<{ surveyId: string; submissionId: string }>,
    res: Response<SurveySubmissionEntry>
  ): Promise<void> => {
    const { surveyId, submissionId } = req.params;
    const { aclService } = req.scope.cradle;

    await aclService.findAndCheckRecordAccess(Survey, 'submissions', {
      attributes: ['id'],
      where: { id: surveyId },
    });

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
    const { surveyId, submissionId } = req.params;
    const { aclService } = req.scope.cradle;

    await aclService.findAndCheckRecordAccess(Survey, 'submissions', {
      attributes: ['id'],
      where: { id: surveyId },
    });

    const submission = await SurveySubmission.findOne({
      attributes: ['id', 'userId'],
      where: { id: submissionId, surveyId },
    });
    if (!submission) throw new NotFoundError();

    await Promise.all([
      submission.destroy(),
      cache.forget(`user-submissions:${submission.userId}`),
    ]);

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
