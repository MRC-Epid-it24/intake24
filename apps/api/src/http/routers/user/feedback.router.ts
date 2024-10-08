import type { Request } from 'express';
import { initServer } from '@ts-rest/express';

import ioc from '@intake24/api/ioc';
import { contract } from '@intake24/common/contracts';
import { UserSurveyAlias } from '@intake24/db';

import { ForbiddenError, NotFoundError } from '../../errors';

export function feedback() {
  const feedbackRateLimiter = ioc.cradle.rateLimiter.createMiddleware('feedback', {
    message: (req: Request) => req.scope.cradle.i18nService.translate('rateLimit.feedback'),
    skipFailedRequests: true,
  });

  return initServer().router(contract.user.feedback, {
    download: {
      middleware: [feedbackRateLimiter],
      handler: async ({ query, req, res }) => {
        const { lang, survey: slug, submissions } = query;
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
        if (!alias?.survey)
          throw new NotFoundError();
        const { survey, username } = alias;

        if (!survey.feedbackScheme?.outputs.includes('download'))
          throw new ForbiddenError();

        const { pdfStream } = await req.scope.cradle.feedbackService.getFeedbackStream({ surveyId: survey.id, username, submissions, lang });
        const filename = `Intake24-MyFeedback-${new Date().toISOString().substring(0, 10)}.pdf`;

        res.set('content-disposition', `attachment; filename=${filename}`);

        return { status: 200, contentType: 'application/pdf', body: pdfStream };
      },
    },
    email: {
      middleware: [feedbackRateLimiter],
      handler: async ({ body, req }) => {
        const { email: to, lang, survey: slug, submissions } = body;
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
        if (!alias?.survey)
          throw new NotFoundError();
        const { survey, username } = alias;

        if (!survey.feedbackScheme?.outputs.includes('email'))
          throw new ForbiddenError();

        await req.scope.cradle.scheduler.jobs.addJob({
          type: 'SurveyFeedbackNotification',
          userId,
          params: { surveyId: survey.id, username, to, lang, submissions },
        });

        return { status: 200, body: undefined };
      },
    },
  });
}
