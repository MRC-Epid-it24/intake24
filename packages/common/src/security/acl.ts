export const ACL_PERMISSIONS_KEY = 'acl:permissions';
export const ACL_ROLES_KEY = 'acl:roles';

export const respondentSuffix = '/respondent';

export const globalSupport = 'globalsupport';

export const surveyRespondent = (surveySlug: string): string => `${surveySlug}${respondentSuffix}`;

export const surveyPermissions = (surveySlug: string): string[] => [surveyRespondent(surveySlug)];

export const standardSecurableActions = ['read', 'edit', 'delete', 'securables'] as const;

export const securableDefs = {
  FeedbackScheme: [
    ...standardSecurableActions,
    'copy',
    'top-foods',
    'meals',
    'cards',
    'demographic-groups',
    'henry-coefficients',
  ] as const,
  Language: [...standardSecurableActions, 'translations'] as const,
  Locale: [
    ...standardSecurableActions,
    'copy',
    'food-list',
    'split-lists',
    'recipe-foods',
    'split-words',
    'synonym-sets',
    'food-ranking',
    'tasks',
  ] as const,
  SurveyScheme: [...standardSecurableActions, 'copy', 'prompts', 'data-export'] as const,
  Survey: [
    ...standardSecurableActions,
    'overrides',
    'respondents',
    'submissions',
    'data-export',
    'support',
  ] as const,
};

export type SecurableType = keyof typeof securableDefs;

export const securableTypes = Object.keys(securableDefs) as SecurableType[];

export type FeedbackSchemeSecurableActions = (typeof securableDefs.FeedbackScheme)[number];

export type SurveySchemeSecurableActions = (typeof securableDefs.SurveyScheme)[number];

export type SurveySecurableActions = (typeof securableDefs.Survey)[number];

export const isSecurableType = (type: any): type is SecurableType => securableTypes.includes(type);
