import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { User } from '@intake24/db';
import { ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import { Survey } from '@intake24/db';

const userFeedbackController = ({
  feedbackService,
  scheduler,
}: Pick<IoC, 'feedbackService' | 'scheduler'>) => {
  const download = async (
    req: Request<any, any, any, { survey: string; submissions?: string[] }>,
    res: Response<Buffer>
  ): Promise<void> => {
    const { survey: slug, submissions } = req.query;
    const { id: userId } = req.user as User;

    const survey = await Survey.findBySlug(slug, {
      attributes: ['id'],
      include: [{ association: 'feedbackScheme', attributes: ['outputs'] }],
    });
    if (!survey) throw new NotFoundError();

    if (!survey.feedbackScheme?.outputs.includes('download')) throw new ForbiddenError();

    const { pdfStream } = await feedbackService.getFeedbackStream(survey.id, userId, submissions);
    const filename = `Intake24-MyFeedback-${new Date().toISOString().substring(0, 10)}.pdf`;

    res.set('content-type', 'application/pdf');
    res.set('content-disposition', `attachment; filename=${filename}`);
    pdfStream.pipe(res);
  };

  const email = async (
    req: Request<any, any, any, { survey: string; submissions?: string[] }>,
    res: Response<undefined>
  ): Promise<void> => {
    const {
      body: { email: to },
      query: { survey: slug, submissions },
    } = req;
    const { id: userId } = req.user as User;

    const survey = await Survey.findBySlug(slug, {
      attributes: ['id'],
      include: [{ association: 'feedbackScheme', attributes: ['outputs'] }],
    });
    if (!survey) throw new NotFoundError();

    if (!survey.feedbackScheme?.outputs.includes('email')) throw new ForbiddenError();

    await scheduler.jobs.addJob({
      type: 'SurveyFeedbackNotification',
      userId,
      params: { surveyId: survey.id, userId, to, submissions },
    });

    res.json();
  };

  return { download, email };
};

export default userFeedbackController;

export type UserFeedbackController = ReturnType<typeof userFeedbackController>;
