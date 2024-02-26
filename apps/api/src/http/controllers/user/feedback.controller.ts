import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import { ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import { UserSurveyAlias } from '@intake24/db';

const userFeedbackController = ({
  feedbackService,
  scheduler,
}: Pick<IoC, 'feedbackService' | 'scheduler'>) => {
  const download = async (
    req: Request<any, any, any, { survey: string; submissions?: string[] }>,
    res: Response<Buffer>
  ): Promise<void> => {
    const { survey: slug, submissions } = req.query;
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

    const { pdfStream } = await feedbackService.getFeedbackStream(survey.id, username, submissions);
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

    await scheduler.jobs.addJob({
      type: 'SurveyFeedbackNotification',
      userId,
      params: { surveyId: survey.id, username, to, submissions },
    });

    res.json();
  };

  return { download, email };
};

export default userFeedbackController;

export type UserFeedbackController = ReturnType<typeof userFeedbackController>;
