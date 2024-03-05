import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const subscriptionSchema = z.object({
  endpoint: z.string(),
  expirationTime: z.union([z.number(), z.date(), z.null()]),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export const subscription = initContract().router({
  subscribe: {
    method: 'POST',
    path: '/subscriptions',
    body: z.object({
      subscription: subscriptionSchema,
    }),
    responses: {
      200: z.undefined(),
    },
    summary: 'Subscribe to push notification',
  },
  unsubscribe: {
    method: 'DELETE',
    path: '/subscriptions',
    body: null,
    responses: {
      200: z.undefined(),
    },
    summary: 'Unsubscribe from push notification',
  },
  push: {
    method: 'POST',
    path: '/subscriptions/push',
    body: null,
    responses: {
      200: z.undefined(),
    },
    summary: 'Trigger push notification',
  },
});
