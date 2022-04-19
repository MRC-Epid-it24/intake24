export const ACL_PERMISSIONS_KEY = 'acl:permissions';
export const ACL_ROLES_KEY = 'acl:roles';

export const respondentSuffix = '/respondent';
export const foodDatabaseMaintainerPrefix = 'fdbm/';

export const globalsupport = 'globalsupport';
export const foodsAdmin = 'foodsadmin';

export const surveyRespondent = (surveySlug: string): string => `${surveySlug}${respondentSuffix}`;

export const surveyPermissions = (surveySlug: string): string[] => [surveyRespondent(surveySlug)];

export const foodDatabaseMaintainer = (localeId: string): string =>
  `${foodDatabaseMaintainerPrefix}${localeId}`;

export const foodDatabasePermissions = (localeId: string): string[] => [
  foodDatabaseMaintainer(localeId),
];

export const standardSecurableActions = ['read', 'edit', 'delete', 'securables'] as const;

export const securableDefs = {
  FeedbackScheme: [
    ...standardSecurableActions,
    'copy',
    'top-foods',
    'cards',
    'demographic-groups',
    'henry-coefficients',
  ] as const,
  SurveyScheme: [...standardSecurableActions, 'copy', 'questions', 'data-export'] as const,
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

export type FeedbackSchemeSecurableActions = typeof securableDefs.FeedbackScheme[number];

export type SurveySchemeSecurableActions = typeof securableDefs.FeedbackScheme[number];

export const isSecurableType = (type: any): type is SecurableType => securableTypes.includes(type);
