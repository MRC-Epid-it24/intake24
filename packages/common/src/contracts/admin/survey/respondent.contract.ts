import { Readable } from 'node:stream';

import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { emailCopy } from '@intake24/common/types';
import { paginationMeta, paginationRequest } from '@intake24/common/types/http';
import { createRespondentRequest, respondentEntry, respondentListEntry, respondentRequest } from '@intake24/common/types/http/admin';

export const respondent = initContract().router({
  browse: {
    method: 'GET',
    path: '/admin/surveys/:surveyId/respondents',
    query: paginationRequest,
    responses: {
      200: z.object({
        data: respondentListEntry.array(),
        meta: paginationMeta,
      }),
    },
    summary: 'Browse respondents',
    description: 'Browse survey respondents (paginated list)',
  },
  store: {
    method: 'POST',
    path: '/admin/surveys/:surveyId/respondents',
    body: createRespondentRequest,
    responses: {
      201: respondentEntry,
    },
    summary: 'Create respondent',
    description: 'Create new respondent',
  },
  read: {
    method: 'GET',
    path: '/admin/surveys/:surveyId/respondents/:username',
    responses: {
      200: respondentEntry,
    },
    summary: 'Get respondent',
    description: 'Get survey respondent by username',
  },
  update: {
    method: 'PATCH',
    path: '/admin/surveys/:surveyId/respondents/:username',
    body: respondentRequest,
    responses: {
      200: respondentEntry,
    },
    summary: 'Update respondent',
    description: 'Update survey respondent by username',
  },
  destroy: {
    method: 'DELETE',
    path: '/admin/surveys/:surveyId/respondents/:username',
    body: null,
    responses: {
      204: z.undefined(),
    },
    summary: 'Delete respondent',
    description: 'Delete survey respondent by username',
  },
  downloadFeedback: {
    method: 'GET',
    path: '/admin/surveys/:surveyId/respondents/:username/feedback',
    query: z.object({
      submissions: z.array(z.string().uuid()).optional(),
    }),
    responses: {
      200: z.instanceof(Readable),
    },
    summary: 'Download feedback',
    description: 'Download feedback as PDF. Returns stream as application/pdf.',
  },
  emailFeedback: {
    method: 'POST',
    path: '/admin/surveys/:surveyId/respondents/:username/feedback',
    query: z.object({
      submissions: z.array(z.string().uuid()).optional(),
    }),
    body: z
      .object({
        email: z.string().email().toLowerCase(),
        // emailConfirm: z.string().email().toLowerCase(),
        copy: z.enum(emailCopy),
      }), /* .refine(data => data.email === data.emailConfirm, {
        path: ['emailConfirm'],
        message: 'Emails do not match',
      }), */
    responses: {
      200: z.undefined(),
    },
    summary: 'Email respondent feedback',
    description: 'Email respondent feedback as PDF file attachment',
  },
});
