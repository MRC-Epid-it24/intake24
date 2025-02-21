import type { Config } from '@intake24/api/config';
import type { JobParams } from '@intake24/common/types';

import { KyselyDatabases } from '@intake24/db';

export type ResourceOps = {
  config: Config;
  kyselyDb: KyselyDatabases;
  params: JobParams['ResourceExport'];
};
