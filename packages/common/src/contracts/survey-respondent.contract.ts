import { initContract } from '@ts-rest/core';

import { createSanitizer } from '../rules';
import { surveyState } from '../surveys';
import {
  foodSearchResponse,
  surveyEntryResponse,
  surveyFoodSearchQuery,
  surveyHelpRequest,
  surveyRatingRequest,
  surveySubmissionResponse,
  surveyUserInfoResponse,
  surveyUserSessionResponse,
} from '../types/http';
import { z } from '../util';

const tzOffset = z.coerce.number().openapi({ description: 'Client timezone offset in minutes' });

export const surveyRespondent = initContract().router({
  parameters: {
    method: 'GET',
    path: '/surveys/:slug/parameters',
    responses: {
      200: surveyEntryResponse,
    },
    summary: 'Survey parameters',
    description:
      'Returns survey parameters such as the scheme ID, current status, custom HTML content etc.',
  },
  userInfo: {
    method: 'GET',
    path: '/surveys/:slug/user-info',
    query: z.object({ tzOffset }),
    responses: {
      200: surveyUserInfoResponse,
    },
    summary: 'User info',
    description:
      'Returns a subset of personal data for the current user that is relevant to the recall application.',
  },
  getSession: {
    method: 'GET',
    path: '/surveys/:slug/session',
    responses: {
      200: surveyUserSessionResponse,
    },
    summary: 'Get user session',
    description:
      'Get survey user session (current recall state), if any. Functionality is controlled by survey settings.',
  },
  startSession: {
    method: 'POST',
    path: '/surveys/:slug/session',
    body: z.object({ session: surveyState }),
    responses: {
      200: z.undefined(),
    },
    summary: 'Start user session',
    description:
      'Start survey user session (current recall state).',
  },
  saveSession: {
    method: 'PUT',
    path: '/surveys/:slug/session',
    body: z.object({ session: surveyState }),
    responses: {
      200: z.undefined(),
    },
    summary: 'Set user session',
    description:
      'Save survey user session (current recall state) on server. Functionality is controlled by survey settings.',
  },
  clearSession: {
    method: 'DELETE',
    path: '/surveys/:slug/session/:sessionId?',
    body: null,
    responses: {
      204: z.undefined(),
    },
    summary: 'Clear user session',
    description:
      'Clear survey user session (current recall state).',
  },
  requestHelp: {
    method: 'POST',
    path: '/surveys/:slug/request-help',
    body: surveyHelpRequest,
    responses: {
      200: z.undefined(),
    },
    summary: 'Request help',
    description:
      'Notify people having survey support role or survey support email to give the respondent a call to help them complete their recall.',
  },
  rating: {
    method: 'POST',
    path: '/surveys/:slug/rating',
    body: surveyRatingRequest,
    responses: {
      200: z.undefined(),
    },
    summary: 'Send rating',
    description: 'Submit 5-start rating about the survey recall experience.',
  },
  submission: {
    method: 'POST',
    path: '/surveys/:slug/submission',
    headers: z.object({
      'user-agent': z.string().optional().transform(createSanitizer()),
    }),
    query: z.object({ tzOffset }),
    body: z.object({ submission: surveyState }),
    responses: {
      200: surveySubmissionResponse,
    },
    summary: 'Submit recall',
    description: 'Submit recall data to the server.',
  },
  foodSearch: {
    method: 'GET',
    path: '/surveys/:slug/search',
    query: surveyFoodSearchQuery,
    responses: {
      200: foodSearchResponse,
    },
    summary: 'Food search',
    description: 'Returns a list of foods from the food database that match the description using the study search settings.',
  },
});
