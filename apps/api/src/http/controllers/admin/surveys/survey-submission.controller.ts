import type { Request, Response } from 'express';
import { pick } from 'lodash';
import validator from 'validator';

import type { IoC } from '@intake24/api/ioc';
import type {
  SurveySubmissionEntry,
  SurveySubmissionsResponse,
} from '@intake24/common/types/http/admin';
import type { PaginateQuery, SurveySubmissionAttributes, WhereOptions } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { Op, submissionScope, Survey, SurveySubmission } from '@intake24/db';

import { getAndCheckAccess } from '../securable.controller';

const adminSurveySubmissionController = ({ cache }: Pick<IoC, 'cache'>) => {
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
      else
        where['$user.aliases.username$'] = {
          [SurveySubmission.sequelize?.getDialect() === 'postgres'
            ? Op.iLike
            : Op.substring]: `%${search}%`,
        };
    }

    const submissions = await SurveySubmission.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      where,
      include: [
        { association: 'user', include: [{ association: 'aliases', where: { surveyId } }] },
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

    await Promise.all([
      submission.destroy(),
      cache.forget(`user:submissions:${submission.userId}`),
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
