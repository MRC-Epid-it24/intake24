import type { Schema } from 'express-validator';

import type { SecurableType } from '@intake24/common/security';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { securableDefs } from '@intake24/common/security';

export default (securable: SecurableType): Schema => ({
  actions: {
    in: ['body'],
    errorMessage: typeErrorMessage('array.min', { min: 1 }),
    isArray: { options: { min: 1 }, bail: true },
    custom: {
      options: async (value: any[], meta): Promise<void> => {
        if (value.some((action) => !securableDefs[securable].includes(action)))
          throw new Error(customTypeErrorMessage('in._', meta));
      },
    },
  },
});
