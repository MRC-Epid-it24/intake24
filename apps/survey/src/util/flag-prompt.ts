import type { FoodFlag } from '@intake24/common/surveys';

// Some flags are parsed based on the prefix (e.g. search-category:xxxx), and adding
// a -complete suffix is not enough because it will be parsed as invalid value xxxx-complete
export function flagPromptCompletionFlag(flag: FoodFlag): FoodFlag {
  return `--${flag}-complete`;
}
