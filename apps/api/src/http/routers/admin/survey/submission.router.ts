import type { WhereOptions } from 'sequelize';
import { initServer } from '@ts-rest/express';
import { Op } from 'sequelize';
import { isUUID } from 'validator';

import type { SurveySubmissionAttributes } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { permission } from '@intake24/api/http/middleware';
import { contract } from '@intake24/common/contracts';
import { submissionScope, Survey, SurveySubmission } from '@intake24/db';

export function submission() {
  return initServer().router(contract.admin.survey.submission, {
    browse: {
      middleware: [permission('surveys')],
      handler: async ({ params: { surveyId }, query, req }) => {
        await req.scope.cradle.aclService.findAndCheckRecordAccess(Survey, 'submissions', {
          attributes: ['id'],
          where: { id: surveyId },
        });

        const { search } = query;

        const where: WhereOptions<SurveySubmissionAttributes> = { surveyId };
        if (typeof search === 'string' && search) {
          if (isUUID(search)) {
            where.id = search;
          }
          else {
            where['$user.aliases.username$'] = {
              [SurveySubmission.sequelize?.getDialect() === 'postgres' ? Op.iLike : Op.substring]:
            `%${search}%`,
            };
          }
        }

        const submissions = await SurveySubmission.paginate({
          query,
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

        return { status: 200, body: submissions };
      },
    },
    read: {
      middleware: [permission('surveys')],
      handler: async ({ params: { surveyId, submissionId }, req }) => {
        await req.scope.cradle.aclService.findAndCheckRecordAccess(Survey, 'submissions', {
          attributes: ['id'],
          where: { id: surveyId },
        });

        const scope = submissionScope({ surveyId });
        const submission = await SurveySubmission.findOne({
          ...scope,
          where: { ...scope.where, id: submissionId },
        });
        if (!submission)
          throw new NotFoundError();

        return { status: 200, body: submission };
      },
    },
    destroy: {
      middleware: [permission('surveys')],
      handler: async ({ params: { surveyId, submissionId }, req }) => {
        await req.scope.cradle.aclService.findAndCheckRecordAccess(Survey, 'submissions', {
          attributes: ['id'],
          where: { id: surveyId },
        });

        const submission = await SurveySubmission.findOne({
          attributes: ['id', 'userId'],
          where: { id: submissionId, surveyId },
        });
        if (!submission)
          throw new NotFoundError();

        await Promise.all([
          submission.destroy(),
          req.scope.cradle.cache.forget(`user-submissions:${submission.userId}`),
        ]);

        return { status: 204, body: undefined };
      },
    },
  });
}
