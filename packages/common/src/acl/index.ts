export const ACL_PERMISSIONS_KEY = 'acl:permissions';
export const ACL_ROLES_KEY = 'acl:roles';

export const respondentSuffix = '/respondent';
export const staffSuffix = '/staff';
export const supportSuffix = '/support';
export const foodDatabaseMaintainerPrefix = 'fdbm/';

export const globalsupport = 'globalsupport';
export const surveyAdmin = 'surveyadmin';
export const foodsAdmin = 'foodsadmin';

export const surveyStaff = (surveyId: string): string => `${surveyId}${staffSuffix}`;

export const surveySupport = (surveyId: string): string => `${surveyId}${supportSuffix}`;

export const surveyMgmt = (surveyId: string): string[] => [
  surveyStaff(surveyId),
  surveySupport(surveyId),
];

export const surveyRespondent = (surveyId: string): string => `${surveyId}${respondentSuffix}`;

export const surveyPermissions = (surveyId: string): string[] => [
  surveyRespondent(surveyId),
  surveyStaff(surveyId),
  surveySupport(surveyId),
];

export const foodDatabaseMaintainer = (localeId: string): string =>
  `${foodDatabaseMaintainerPrefix}${localeId}`;

export const foodDatabasePermissions = (localeId: string): string[] => [
  foodDatabaseMaintainer(localeId),
];

export const standardSecurableActions = ['read', 'edit', 'delete', 'securables'] as const;

export const securableDefs = {
  FeedbackScheme: [
    ...standardSecurableActions,
    'top-foods',
    'cards',
    'demographic-groups',
    'henry-coefficients',
  ] as const,
  SurveyScheme: [...standardSecurableActions, 'questions', 'data-export'] as const,
};

export type SecurableType = keyof typeof securableDefs;

export const securableTypes = Object.keys(securableDefs) as SecurableType[];

export type FeedbackSchemeSecurableActions = typeof securableDefs.FeedbackScheme[number];

export type SurveySchemeSecurableActions = typeof securableDefs.FeedbackScheme[number];

export const isSecurableType = (type: any): type is SecurableType => securableTypes.includes(type);
