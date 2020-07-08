import Locale from '@/db/models/system/locale';
import Survey from '@/db/models/system/survey';

export enum Roles {
  FOODSADMIN = 'foodsadmin',
  IMAGESADMIN = 'imagesadmin',
  GLOBALSUPPORT = 'globalsupport',
  SURVEYADMIN = 'surveyadmin',
  SUPERUSER = 'superuser',
}

export const respondentSuffix = '/respondent';
export const staffSuffix = '/staff';
export const supportSuffix = '/support';
export const foodDatabaseMaintainerPrefix = 'fdbm/';

export const surveyStaff = (surveyId: string): string => `${surveyId}${staffSuffix}`;

export const surveySupport = (surveyId: string): string => `${surveyId}${supportSuffix}`;

export const surveyMgmt = (surveyId: string): string[] => [
  surveyStaff(surveyId),
  surveySupport(surveyId),
];

export const surveyRespondent = (surveyId: string): string => `${surveyId}${respondentSuffix}`;

export const foodDatabaseMaintainer = (fdbId: string): string =>
  `${foodDatabaseMaintainerPrefix}${fdbId}`;

export const roleList = async (): Promise<string[]> => {
  const roles = Object.values(Roles) as string[];

  const fdbs = await Locale.findAll();
  fdbs.reduce((acc, item) => {
    acc.push(`${foodDatabaseMaintainerPrefix}${item.id}`);
    return acc;
  }, roles);

  const surveys = await Survey.findAll();
  surveys.reduce((acc, item) => {
    acc.push(`${item.id}${respondentSuffix}`);
    acc.push(`${item.id}${supportSuffix}`);
    acc.push(`${item.id}${staffSuffix}`);
    return acc;
  }, roles);

  return roles;
};
