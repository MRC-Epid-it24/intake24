import { Request, Response } from 'express';
import { Survey, User } from '@/db/models/system';
import type { IoC } from '@/ioc';
import { JobResponse } from '@common/types/http/admin';
import { NotFoundError } from '@/http/errors';
import { Controller } from '../controller';

export type AdminSurveyDataExportController = Controller<'sync' | 'queue'>;

export default ({
  dataExportService,
}: Pick<IoC, 'dataExportService'>): AdminSurveyDataExportController => {
  const sync = async (req: Request, res: Response<Buffer>): Promise<void> => {
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

  const queue = async (req: Request, res: Response<JobResponse>): Promise<void> => {
    const { surveyId } = req.params;
    const { startDate, endDate } = req.body;
    const { id: userId } = req.user as User;

    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    const job = await dataExportService.queueExportJob({ surveyId, startDate, endDate, userId });

    res.json({ data: job });
  };

  return {
    sync,
    queue,
  };
};
