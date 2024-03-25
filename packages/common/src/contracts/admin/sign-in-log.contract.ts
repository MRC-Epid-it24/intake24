import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { paginationMeta, paginationRequest } from '@intake24/common/types/http';
import { signInLogAttributes } from '@intake24/common/types/http/admin';

export const signInLog = initContract().router({
  browse: {
    method: 'GET',
    path: '/admin/sign-in-logs',
    query: paginationRequest,
    responses: {
      200: z.object({
        data: signInLogAttributes.array(),
        meta: paginationMeta,
      }),
    },
    summary: 'Browse sign-in logs',
    description: 'Browse sign-in logs (paginated list)',
  },
  read: {
    method: 'GET',
    path: '/admin/sign-in-logs/:signInLogId',
    responses: {
      200: signInLogAttributes,
    },
    summary: 'Get sign-in log',
    description: 'Get sign-in log by id',
  },
  destroy: {
    method: 'DELETE',
    path: '/admin/sign-in-logs/:signInLogId',
    body: null,
    responses: {
      204: z.undefined(),
    },
    summary: 'Delete sign-in log',
    description: 'Delete sign-in log by id',
  },
});
