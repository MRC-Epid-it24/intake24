import { z } from 'zod';

export const surveySubmissionAttributes = z.object({
  id: z.string().uuid(),
  surveyId: z.string(),
  userId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  submissionTime: z.date(),
  log: z.string().nullable(),
  sessionId: z.string().uuid(),
  userAgent: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SurveySubmissionAttributes = z.infer<typeof surveySubmissionAttributes>;

export type SurveySubmissionEntry = SurveySubmissionAttributes;

export const surveySubmissionWithUsername = surveySubmissionAttributes.extend({
  username: z.string(),
});
export type SurveySubmissionWithUsername = z.infer<typeof surveySubmissionWithUsername>;
