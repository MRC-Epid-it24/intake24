import type { JobType } from '@intake24/common/types';

import LanguageSyncTranslations from './language-sync-translations';
import LocaleCopyPairwiseAssociations from './locale-copy-pairwise-associations';
import NutrientTableImportData from './nutrient-table-import-data';
import NutrientTableImportMapping from './nutrient-table-import-mapping';
import surveys from './surveys';
import system from './system';

export * from './job';
export { default as Job } from './job';
export { default as StreamLockJob } from './stream-lock-job';

const jobs = {
  // Languages
  LanguageSyncTranslations,
  // Locales
  LocaleCopyPairwiseAssociations,
  // Nutrient tables
  NutrientTableImportData,
  NutrientTableImportMapping,
  ...surveys,
  ...system,
};

export type Jobs = {
  [P in JobType]: new (...args: any[]) => typeof jobs[P];
};

export default jobs;
