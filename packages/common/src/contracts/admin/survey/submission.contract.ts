import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { paginationMeta, paginationRequest } from '@intake24/common/types/http';
import {
  surveySubmissionAttributes,
  surveySubmissionWithUsername,
} from '@intake24/common/types/http/admin';

export const submission = initContract().router({
  browse: {
    method: 'GET',
    path: '/admin/surveys/:surveyId/submissions',
    query: paginationRequest,
    responses: {
      200: z.object({
        data: surveySubmissionWithUsername.array(),
        meta: paginationMeta,
      }),
    },
    summary: 'Browse submissions',
    description: 'Browse submissions (paginated list)',
  },
  read: {
    method: 'GET',
    path: '/admin/surveys/:surveyId/submissions/:submissionId',
    responses: {
      200: surveySubmissionAttributes,
    },
    summary: 'Get submission',
    description: 'Get submission by id',
  },
  destroy: {
    method: 'DELETE',
    path: '/admin/surveys/:surveyId/submissions/:submissionId',
    body: null,
    responses: {
      204: z.undefined(),
    },
    summary: 'Delete submission',
    description: 'Delete submission by id',
  },
});
