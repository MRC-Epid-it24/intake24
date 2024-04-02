import type { WhereOptions } from 'sequelize';
import { initServer } from '@ts-rest/express';
import { Op } from 'sequelize';
import { isUUID } from 'validator';

import type { UserSurveySessionAttributes } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { permission } from '@intake24/api/http/middleware';
import { contract } from '@intake24/common/contracts';
import { Survey, UserSurveySession } from '@intake24/db';

export const session = () => {
  return initServer().router(contract.admin.survey.session, {
    browse: {
      middleware: [permission('surveys')],
      handler: async ({ params: { surveyId }, query, req }) => {
        await req.scope.cradle.aclService.findAndCheckRecordAccess(Survey, 'sessions', {
          attributes: ['id'],
          where: { id: surveyId },
        });

        const { search } = query;

        const where: WhereOptions<UserSurveySessionAttributes> = { surveyId };
        if (typeof search === 'string' && search) {
          if (isUUID(search)) where.id = search;
          else
            where['$user.aliases.username$'] = {
              [UserSurveySession.sequelize?.getDialect() === 'postgres' ? Op.iLike : Op.substring]:
                `%${search}%`,
            };
        }

        const sessions = await UserSurveySession.paginate({
          query,
          where,
          include: [{ association: 'alias', attributes: ['username'], where: { surveyId } }],
          order: [['createdAt', 'ASC']],
          subQuery: false,
          transform: (session) => {
            const { alias, ...rest } = session.get();

            return { ...rest, username: alias!.username };
          },
        });

        return { status: 200, body: sessions };
      },
    },
    read: {
      middleware: [permission('surveys')],
      handler: async ({ params: { surveyId, sessionId }, req }) => {
        await req.scope.cradle.aclService.findAndCheckRecordAccess(Survey, 'sessions', {
          attributes: ['id'],
          where: { id: surveyId },
        });

        const session = await UserSurveySession.findOne({ where: { id: sessionId, surveyId } });
        if (!session) throw new NotFoundError();

        return { status: 200, body: session };
      },
    },
    destroy: {
      middleware: [permission('surveys')],
      handler: async ({ params: { surveyId, sessionId }, req }) => {
        await req.scope.cradle.aclService.findAndCheckRecordAccess(Survey, 'sessions', {
          attributes: ['id'],
          where: { id: surveyId },
        });

        const session = await UserSurveySession.findOne({ where: { id: sessionId, surveyId } });
        if (!session) throw new NotFoundError();

        await session.destroy();

        return { status: 204, body: undefined };
      },
    },
  });
};
