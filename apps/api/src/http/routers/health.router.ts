import { initServer } from '@ts-rest/express';

import { contract } from '@intake24/common/contracts';

export function health() {
  return initServer().router(contract.public.health, {
    ping: {
      handler: async () => {
        return { status: 200, body: undefined };
      },
    },
  });
}
