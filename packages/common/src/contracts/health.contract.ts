import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export const health = initContract().router({
  ping: {
    method: 'GET',
    path: '/ping',
    responses: {
      200: z.undefined(),
    },
    summary: 'Ping',
    description: 'Send ping to the server to check if it is up and running.',
  },
});
