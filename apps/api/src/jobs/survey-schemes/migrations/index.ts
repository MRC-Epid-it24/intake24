import { SurveyScheme } from '@intake24/db';

import migrateToV2 from './2_refactor_conditions';
import migrateToV3 from './3_prompt_answer_optional';

export type SurveySchemeMigration = (scheme: SurveyScheme) => { version: number; prompts: object | undefined; meals: object | undefined; dataExport: object | undefined };

export default {
  1: migrateToV2,
  2: migrateToV3,
} as {
  [v: number]: SurveySchemeMigration;
};
