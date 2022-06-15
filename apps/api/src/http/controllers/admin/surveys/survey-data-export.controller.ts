import type { Request, Response } from 'express';
import type { JobEntry } from '@intake24/common/types/http/admin';
import type { User } from '@intake24/db';
import type { IoC } from '@intake24/api/ioc';
import type { Controller } from '../../controller';
import { getAndCheckSurveyAccess } from './survey.controller';

export type AdminSurveyDataExportController = Controller<'sync' | 'queue'>;

export default ({
  dataExportService,
}: Pick<IoC, 'dataExportService'>): AdminSurveyDataExportController => {
  const sync = async (req: Request<{ surveyId: string }>, res: Response<Buffer>): Promise<void> => {
    const { id: surveyId } = await getAndCheckSurveyAccess(req, 'data-export');
    const { startDate, endDate } = req.body;

    const { filename, stream } = await dataExportService.syncStream({
      surveyId,
      startDate,
      endDate,
    });

    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename=${filename}`);
    stream.pipe(res);
  };

  const queue = async (
    req: Request<{ surveyId: string }>,
    res: Response<JobEntry>
  ): Promise<void> => {
    const { id: surveyId } = await getAndCheckSurveyAccess(req, 'data-export');
    const { startDate, endDate } = req.body;
    const { id: userId } = req.user as User;

    const job = await dataExportService.queueExportJob({ surveyId, startDate, endDate, userId });

    res.json(job);
  };

  return {
    sync,
    queue,
  };
};
