import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { SignInLogEntry, SignInLogsResponse } from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { SignInLog } from '@intake24/db';

const signInLogController = () => {
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

    const signInLog = await SignInLog.findByPk(signInLogId, { attributes: ['id'] });
    if (!signInLog) throw new NotFoundError();

    await signInLog.destroy();
    res.status(204).json();
  };

  const refs = async (): Promise<void> => {
    throw new NotFoundError();
  };

  return {
    browse,
    read,
    destroy,
    refs,
  };
};

export default signInLogController;

export type SignInLogController = ReturnType<typeof signInLogController>;
