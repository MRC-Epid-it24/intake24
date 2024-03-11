import { initContract } from '@ts-rest/core';

import { feedbackDataResponse } from '../types/http';

export const feedback = initContract().router({
  data: {
    method: 'GET',
    path: '/feedback',
    responses: {
      200: feedbackDataResponse,
    },
    summary: 'Feedback data',
    description: 'Get reference data for feedback.',
  },
});
