import { Request, Response } from 'express';
import { SignInLogEntry, SignInLogsResponse } from '@common/types/http/admin';
import { SignInLog } from '@api/db/models/system';
import { NotFoundError } from '@api/http/errors';
import { pick } from 'lodash';
import { PaginateQuery } from '@api/db/models/model';
import { Controller } from '../controller';

export type SignInLogController = Controller<'browse' | 'read' | 'destroy'>;

export default (): SignInLogController => {
  const entry = async (
    req: Request<{ signInLogId: string }>,
    res: Response<SignInLogEntry>
  ): Promise<void> => {
    const { signInLogId } = req.params;

    const signInLog = await SignInLog.findByPk(signInLogId);
    if (!signInLog) throw new NotFoundError();

    res.json(signInLog);
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<SignInLogsResponse>
  ): Promise<void> => {
    const signInLogs = await SignInLog.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'provider', 'providerKey'],
      order: [['id', 'DESC']],
    });

    res.json(signInLogs);
  };

  const read = async (
    req: Request<{ signInLogId: string }>,
    res: Response<SignInLogEntry>
  ): Promise<void> => entry(req, res);

  const destroy = async (
    req: Request<{ signInLogId: string }>,
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
