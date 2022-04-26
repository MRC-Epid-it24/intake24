import type { Request, Response } from 'express';
import { Survey, User } from '@intake24/db';
import type { IoC } from '@intake24/api/ioc';
import { NotFoundError } from '@intake24/api/http/errors';
import type { Controller } from '../controller';

export type UserFeedbackController = Controller<'download' | 'email'>;

export default ({
  feedbackService,
  scheduler,
}: Pick<IoC, 'feedbackService' | 'scheduler'>): UserFeedbackController => {
  const download = async (
    req: Request<any, any, any, { survey: string }>,
    res: Response<Buffer>
  ): Promise<void> => {
    const { survey: slug } = req.query;
    const { id: userId } = req.user as User;

    const survey = await Survey.findOne({ where: { slug } });
    if (!survey) throw new NotFoundError();

    const { pdfStream } = await feedbackService.getFeedbackStream(survey.id, userId);
    const filename = `Intake24-MyFeedback-${new Date().toISOString().substring(0, 10)}.pdf`;

    res.set('content-type', 'application/pdf');
    res.set('content-disposition', `attachment; filename=${filename}`);
    pdfStream.pipe(res);
  };

  const email = async (
    req: Request<any, any, any, { survey: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const {
      body: { email: to },
      query: { survey: slug },
    } = req;
    const { id: userId } = req.user as User;

    const survey = await Survey.findOne({ where: { slug } });
    if (!survey) throw new NotFoundError();

    await scheduler.jobs.addJob(
      { type: 'SendRespondentFeedback', userId },
      { surveyId: survey.id, userId, to }
    );

    res.json();
  };

  return { download, email };
};
