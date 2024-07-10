import { SurveyScheme } from '@intake24/db';

import migrateToV2 from './2_refactor_conditions';

export type SurveySchemeMigration = (scheme: SurveyScheme) => { version: number; prompts: object | undefined; meals: object | undefined; dataExport: object | undefined };

export default {
  1: migrateToV2,
} as {
  [v: number]: SurveySchemeMigration;
};
