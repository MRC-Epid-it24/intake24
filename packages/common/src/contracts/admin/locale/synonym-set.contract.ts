import { initContract } from '@ts-rest/core';

import {
  synonymSetAttributes,
  synonymSetRequest,
} from '@intake24/common/types/http/admin';

export const synonymSet = initContract().router({
  get: {
    method: 'GET',
    path: '/admin/locales/:localeId/synonym-sets',
    responses: {
      200: synonymSetAttributes.array(),
    },
    summary: 'Browse locale synonym sets',
    description: 'Browse locale synonym sets',
  },
  set: {
    method: 'POST',
    path: '/admin/locales/:localeId/synonym-sets',
    body: synonymSetRequest.array(),
    responses: {
      200: synonymSetAttributes.array(),
    },
    summary: 'Set locale synonym sets',
    description: 'Set locale synonym sets',
  },
});
