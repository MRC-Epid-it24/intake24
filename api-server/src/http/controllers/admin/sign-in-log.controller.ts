import { Request, Response } from 'express';
import { SignInLogResponse, SignInLogsResponse } from '@common/types/http/admin';
import { SignInLog } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import { Controller } from '../controller';

export type SignInLogController = Controller<'browse' | 'read' | 'destroy'>;

export default (): SignInLogController => {
  const entry = async (
    req: Request<{ signInLogId: number }>,
    res: Response<SignInLogResponse>
  ): Promise<void> => {
    const { signInLogId } = req.params;

    const signInLog = await SignInLog.findByPk(signInLogId);
    if (!signInLog) throw new NotFoundError();

    res.json({ data: signInLog });
  };

  const browse = async (req: Request, res: Response<SignInLogsResponse>): Promise<void> => {
    const signInLogs = await SignInLog.paginate({
      req,
      columns: ['id', 'provider', 'providerKey'],
      order: [['id', 'DESC']],
    });

    res.json(signInLogs);
  };

  const read = async (
    req: Request<{ signInLogId: number }>,
    res: Response<SignInLogResponse>
  ): Promise<void> => entry(req, res);

  const destroy = async (
    req: Request<{ signInLogId: number }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { signInLogId } = req.params;

    const signInLog = await SignInLog.findByPk(signInLogId);
    if (!signInLog) throw new NotFoundError();

    await signInLog.destroy();
    res.status(204).json();
  };

  return {
    browse,
    read,
    destroy,
  };
};
