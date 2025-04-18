import type { PromptSection } from '@intake24/common/surveys';

import migrateToV2 from './2_refactor_conditions';
import migrateToV3 from './3_prompt_answer_optional';
import migrateToV4 from './4_or_previous_option';

export default {
  1: migrateToV2,
  2: migrateToV3,
  3: migrateToV4,
} as {
  [v: number]: (prompt: object, section?: PromptSection) => { version: number };
};
