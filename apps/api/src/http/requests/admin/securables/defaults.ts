import type { Schema } from 'express-validator';
import { SecurableType, securableDefs } from '@intake24/common/security';

export default (securable: SecurableType): Schema => ({
  actions: {
    in: ['body'],
    custom: {
      options: async (value): Promise<void> => {
        if (
          !Array.isArray(value) ||
          !value.length ||
          value.some((action) => !securableDefs[securable].includes(action))
        )
          throw new Error('Invalid securable action.');
      },
    },
  },
});
