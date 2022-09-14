import type { JobType } from '@intake24/common/types';

import LanguageSyncTranslations from './language-sync-translations';
import nutrientTables from './nutrient-tables';
import search from './search';
import surveys from './surveys';
import system from './system';

export * from './job';
export { default as Job } from './job';
export { default as StreamLockJob } from './stream-lock-job';

const jobs = {
  // Languages
  LanguageSyncTranslations,
  ...nutrientTables,
  ...search,
  ...surveys,
  ...system,
};

export type Jobs = {
  [P in JobType]: new (...args: any[]) => typeof jobs[P];
};

export default jobs;
