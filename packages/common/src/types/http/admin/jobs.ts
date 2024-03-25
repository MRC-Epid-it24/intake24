import { z } from 'zod';

import type { Pagination } from '@intake24/db';

import { jobTypeParams, jobTypes } from '../../jobs';
import { userAttributes } from './users';

export type JobsResponse = Pagination<JobAttributes>;

export const jobAttributes = z.object({
  id: z.string(),
  type: z.enum(jobTypes),
  userId: z.string().nullable(),
  downloadUrl: z.string().nullable(),
  downloadUrlExpiresAt: z.date().nullable(),
  progress: z.number().nullable(),
  successful: z.boolean().nullable(),
  message: z.string().nullable(),
  params: jobTypeParams,
  stackTrace: z.string().array().nullable(),
  startedAt: z.date().nullable(),
  completedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: userAttributes.optional(),
});

export type JobAttributes = z.infer<typeof jobAttributes>;
