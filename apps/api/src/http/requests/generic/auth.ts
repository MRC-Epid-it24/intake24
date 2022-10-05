import type { ParamSchema } from 'express-validator';

import { createSanitizer } from '@intake24/api/http/rules';

export const userAgent: ParamSchema = {
  in: ['headers'],
  customSanitizer: { options: createSanitizer() },
};
