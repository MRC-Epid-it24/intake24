import { initServer } from '@ts-rest/express';

import ioc from '@intake24/api/ioc';
import { contract } from '@intake24/common/contracts';
import { UserSurveyAlias } from '@intake24/db';

import { ForbiddenError, NotFoundError } from '../../errors';

export const feedback = () => {
  const feedbackRateLimiter = ioc.cradle.rateLimiter.createMiddleware('feedback', {
    message: 'You have recently requested the feedback output, please try again later.',
    skipFailedRequests: true,
  });

  return initServer().router(contract.user.feedback, {
    download: {
      middleware: [feedbackRateLimiter],
      handler: async ({ query, req, res }) => {
        const { survey: slug, submissions } = query;
        const { userId } = req.scope.cradle.user;

        const alias = await UserSurveyAlias.findOne({
          where: { userId },
          include: [
            {
              association: 'survey',
              where: { slug },
              attributes: ['id', 'slug'],
              include: [{ association: 'feedbackScheme', attributes: ['outputs'] }],
            },
          ],
        });
        if (!alias?.survey) throw new NotFoundError();
        const { survey, username } = alias;

        if (!survey.feedbackScheme?.outputs.includes('download')) throw new ForbiddenError();

        const { pdfStream } = await req.scope.cradle.feedbackService.getFeedbackStream(
          survey.id,
          username,
          submissions
        );
        const filename = `Intake24-MyFeedback-${new Date().toISOString().substring(0, 10)}.pdf`;

        res.set('content-type', 'application/pdf');
        res.set('content-disposition', `attachment; filename=${filename}`);
        pdfStream.pipe(res);

        return { status: 200, body: undefined };
      },
    },
    email: {
      middleware: [feedbackRateLimiter],
      handler: async ({ body, query, req }) => {
        const { email: to } = body;
        const { survey: slug, submissions } = query;
        const { userId } = req.scope.cradle.user;

        const alias = await UserSurveyAlias.findOne({
          where: { userId },
          include: [
            {
              association: 'survey',
              where: { slug },
              attributes: ['id', 'slug'],
              include: [{ association: 'feedbackScheme', attributes: ['outputs'] }],
            },
          ],
        });
        if (!alias?.survey) throw new NotFoundError();
        const { survey, username } = alias;

        if (!survey.feedbackScheme?.outputs.includes('email')) throw new ForbiddenError();

        await req.scope.cradle.scheduler.jobs.addJob({
          type: 'SurveyFeedbackNotification',
          userId,
          params: { surveyId: survey.id, username, to, submissions },
        });

        return { status: 200, body: undefined };
      },
    },
  });
};
