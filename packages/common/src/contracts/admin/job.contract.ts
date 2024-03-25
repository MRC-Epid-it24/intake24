import { initContract } from '@ts-rest/core';
import { Readable } from 'stream';
import { z } from 'zod';

import { paginationMeta, paginationRequest } from '@intake24/common/types/http';
import { jobAttributes } from '@intake24/common/types/http/admin';

export const job = initContract().router({
  browse: {
    method: 'GET',
    path: '/admin/jobs',
    query: paginationRequest,
    responses: {
      200: z.object({
        data: jobAttributes.array(),
        meta: paginationMeta,
      }),
    },
    summary: 'Browse jobs',
    description: 'Browse jobs (paginated list)',
  },
  read: {
    method: 'GET',
    path: '/admin/jobs/:jobId',
    responses: {
      200: jobAttributes,
    },
    summary: 'Get job',
    description: 'Get job by id',
  },
  destroy: {
    method: 'DELETE',
    path: '/admin/jobs/:jobId',
    body: null,
    responses: {
      204: z.undefined(),
    },
    summary: 'Delete job',
    description: 'Delete job by id',
  },
  download: {
    method: 'GET',
    path: '/admin/jobs/:jobId/download',
    responses: {
      200: z.instanceof(Readable),
    },
    summary: 'Download job attachment',
    description: 'Download job attachment by id (if any and not expired)',
  },
  repeat: {
    method: 'POST',
    path: '/admin/jobs/:jobId/repeat',
    body: null,
    responses: {
      200: jobAttributes,
    },
    summary: 'Repeat job',
    description: 'Repeat job by id with same parameters',
  },
});
