import type { Request, Response } from 'express';
import { User } from '@intake24/db';
import type { IoC } from '@intake24/api/ioc';
import type { Controller } from '../controller';

export type UserFeedbackController = Controller<'download'>;

export default ({
  feedbackService,
}: Pick<IoC, 'appConfig' | 'feedbackService'>): UserFeedbackController => {
  const download = async (
    req: Request<any, any, any, { surveyId: string }>,
    res: Response<Buffer>
  ): Promise<void> => {
    const { surveyId } = req.query;
    const { id: userId } = req.user as User;

    const pdfBuffer = await feedbackService.downloadFeedback(surveyId, userId);
    const filename = `Intake24-MyFeedback-${new Date().toISOString().substring(0, 10)}.pdf`;

    res.set('content-type', 'application/pdf');
    res.set('content-disposition', `attachment; filename=${filename}`);
    pdfBuffer.pipe(res);
  };

  return { download };
};
