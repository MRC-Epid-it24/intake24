import type { Request, Response } from 'express';
import type { JobEntry } from '@intake24/common/types/http/admin';
import { Survey, User } from '@intake24/db';
import type { IoC } from '@intake24/api/ioc';
import { NotFoundError } from '@intake24/api/http/errors';
import type { Controller } from '../../controller';

export type AdminSurveyDataExportController = Controller<'sync' | 'queue'>;

export default ({
  dataExportService,
}: Pick<IoC, 'dataExportService'>): AdminSurveyDataExportController => {
  const sync = async (req: Request<{ surveyId: string }>, res: Response<Buffer>): Promise<void> => {
    const { surveyId } = req.params;
    const { startDate, endDate } = req.body;

    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    const { filename, stream } = await dataExportService.syncStream({
      surveyId,
      startDate,
      endDate,
    });

    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename=${filename}`);
    // res.set('Content-Length', size.toString());
    stream.pipe(res);
  };

  const queue = async (
    req: Request<{ surveyId: string }>,
    res: Response<JobEntry>
  ): Promise<void> => {
    const { surveyId } = req.params;
    const { startDate, endDate } = req.body;
    const { id: userId } = req.user as User;

    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    const job = await dataExportService.queueExportJob({ surveyId, startDate, endDate, userId });

    res.json(job);
  };

  return {
    sync,
    queue,
  };
};
