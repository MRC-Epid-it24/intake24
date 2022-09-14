import type { Schema } from 'express-validator';

import { createSanitizer } from '@intake24/api/http/rules';

export const authHeaders: Schema = {
  'user-agent': {
    in: ['headers'],
    customSanitizer: { options: createSanitizer() },
  },
};
