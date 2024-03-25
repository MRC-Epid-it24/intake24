import { isValidCron } from 'cron-validator';
import { z } from 'zod';

import { jobTypeParams, jobTypes, repeatableBullJob } from '../../jobs';

export const taskRequest = z.object({
  name: z.string().min(3).max(512),
  job: z.enum(jobTypes),
  cron: z.string().refine((val) => isValidCron(val, { seconds: true })),
  active: z.boolean(),
  description: z.string().nullish(),
  params: jobTypeParams,
});

export type TaskRequest = z.infer<typeof taskRequest>;

export const taskAttributes = z.object({
  active: z.boolean(),
  createdAt: z.date(),
  cron: z.string(),
  description: z.string().nullable(),
  id: z.string(),
  job: z.enum(jobTypes),
  name: z.string(),
  params: jobTypeParams,
  updatedAt: z.date(),
});

export type TaskAttributes = z.infer<typeof taskAttributes>;

export const taskResponse = taskAttributes.extend({
  bullJob: repeatableBullJob.optional(),
});

export type TaskResponse = z.infer<typeof taskResponse>;
