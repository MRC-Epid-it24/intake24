export const surveyRatings = ['recall', 'feedback'] as const;
export type SurveyRating = (typeof surveyRatings)[number];

export const surveyStates = ['notStarted', 'active', 'suspended', 'completed'] as const;
export type SurveyState = (typeof surveyStates)[number];

export const searchSortingAlgorithms = [
  // 'paRules', Pairwise association not implemented
  'popularity',
  'globalPop',
  'fixed',
] as const;

export type SearchSortingAlgorithm = (typeof searchSortingAlgorithms)[number];
