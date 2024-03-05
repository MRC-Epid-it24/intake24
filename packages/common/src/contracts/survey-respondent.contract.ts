import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { createSanitizer } from '../rules';
import {
  jsonObjectSchema,
  surveyEntryResponse,
  surveyHelpRequest,
  surveyRatingRequest,
  surveySubmissionResponse,
  surveyUserInfoResponse,
  surveyUserSessionResponse,
} from '../types/http';

export const surveyRespondent = initContract().router({
  parameters: {
    method: 'GET',
    path: '/surveys/:slug/parameters',
    responses: {
      200: surveyEntryResponse,
    },
    summary: 'Get survey parameters',
  },
  userInfo: {
    method: 'GET',
    path: '/surveys/:slug/user-info',
    query: z.object({
      tzOffset: z.coerce.number(),
    }),
    responses: {
      200: surveyUserInfoResponse,
    },
    summary: 'Get user info for survey',
  },
  getSession: {
    method: 'GET',
    path: '/surveys/:slug/session',
    responses: {
      200: surveyUserSessionResponse,
    },
    summary: 'Get user session for survey',
  },
  setSession: {
    method: 'POST',
    path: '/surveys/:slug/session',
    body: z.object({
      sessionData: jsonObjectSchema,
    }),
    responses: {
      200: surveyUserSessionResponse,
    },
    summary: 'Set user session for survey',
  },
  clearSession: {
    method: 'DELETE',
    path: '/surveys/:slug/session',
    body: null,
    responses: {
      200: z.undefined(),
    },
    summary: 'Clear user session for survey',
  },
  requestHelp: {
    method: 'POST',
    path: '/surveys/:slug/request-help',
    body: surveyHelpRequest,
    responses: {
      200: z.undefined(),
    },
    summary: 'Request help for survey',
  },
  rating: {
    method: 'POST',
    path: '/surveys/:slug/rating',
    body: surveyRatingRequest,
    responses: {
      200: z.undefined(),
    },
    summary: 'Send rating for survey',
  },
  submission: {
    method: 'POST',
    path: '/surveys/:slug/submission',
    headers: z.object({
      'user-agent': z.string().optional().transform(createSanitizer()),
    }),
    query: z.object({
      tzOffset: z.coerce.number(),
    }),
    body: z.object({
      // TODO: Define submission schema
      submission: jsonObjectSchema,
    }),
    responses: {
      200: surveySubmissionResponse,
    },
    summary: 'Submit survey recall',
  },
});
