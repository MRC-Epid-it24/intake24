import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { bigIntString as surveyId, paginationMeta, paginationRequest } from '@intake24/common/types/http';
import { userCustomField } from '@intake24/common/types/http/admin';

export const respondentCustomField = initContract().router({
  browse: {
    method: 'GET',
    path: '/admin/surveys/:surveyId/respondents/:username/custom-fields',
    pathParams: z.object({ surveyId }),
    query: paginationRequest,
    responses: {
      200: z.object({
        data: userCustomField.array(),
        meta: paginationMeta,
      }),
    },
    summary: 'Browse respondents custom fields',
    description: 'Browse survey custom fields (paginated list)',
  },
  store: {
    method: 'POST',
    path: '/admin/surveys/:surveyId/respondents/:username/custom-fields',
    pathParams: z.object({ surveyId }),
    body: userCustomField.pick({ name: true, value: true }),
    responses: {
      201: userCustomField,
    },
    summary: 'Create respondent custom field',
    description: 'Create new respondent custom field',
  },
  read: {
    method: 'GET',
    path: '/admin/surveys/:surveyId/respondents/:username/custom-fields/:field',
    pathParams: z.object({ surveyId }),
    responses: {
      200: userCustomField,
    },
    summary: 'Get respondent custom field',
    description: 'Get survey respondent custom field',
  },
  update: {
    method: 'PATCH',
    path: '/admin/surveys/:surveyId/respondents/:username/custom-fields/:field',
    pathParams: z.object({ surveyId }),
    body: userCustomField.pick({ value: true }),
    responses: {
      200: userCustomField,
    },
    summary: 'Update respondent custom field',
    description: 'Update survey respondent custom field',
  },
  upsert: {
    method: 'PUT',
    path: '/admin/surveys/:surveyId/respondents/:username/custom-fields/:field',
    pathParams: z.object({ surveyId }),
    body: userCustomField.pick({ value: true }),
    responses: {
      200: userCustomField,
      201: userCustomField,
    },
    summary: 'Create or update respondent custom field',
    description: 'Create or update survey respondent custom field',
  },
  destroy: {
    method: 'DELETE',
    path: '/admin/surveys/:surveyId/respondents/:username/custom-fields/:field',
    pathParams: z.object({ surveyId }),
    body: null,
    responses: {
      204: z.undefined(),
    },
    summary: 'Delete respondent custom field',
    description: 'Delete survey respondent custom field',
  },
});
