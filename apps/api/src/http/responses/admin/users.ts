import type {
  UserEntry,
  UserMgmtListEntry,
  SurveyRespondentEntry,
  UserSecurableListEntry,
  SurveyRespondentListEntry,
} from '@intake24/common/types/http/admin';
import { User, UserSurveyAlias } from '@intake24/db';
import { permissionListResponse } from './permissions';

export const userEntryResponse = (user: User): UserEntry => {
  const { aliases = [], customFields = [], permissions = [], roles = [] } = user;

  return {
    ...user.get(),
    aliases,
    customFields,
    permissions,
    roles,
  };
};

export const userRespondentResponse = (alias: UserSurveyAlias): SurveyRespondentEntry => {
  const {
    userId,
    userName,
    surveyId,
    urlAuthToken,
    user: { name = null, email = null, phone = null, customFields = [] } = {},
  } = alias;

  return { userId, surveyId, userName, urlAuthToken, name, email, phone, customFields };
};

export const userRespondentListResponse = (alias: UserSurveyAlias): SurveyRespondentListEntry => {
  const { userId, userName, surveyId, urlAuthToken } = alias;

  return { userId, surveyId, userName, urlAuthToken };
};

export const userMgmtResponse = (user: User): UserMgmtListEntry => {
  const { id, name, email, permissions } = user;

  return {
    id,
    name,
    email,
    permissions: permissions ? permissions.map(permissionListResponse) : [],
  };
};

export const userSecurablesResponse = (user: User): UserSecurableListEntry => {
  const { id, name, email, securables = [] } = user;

  return { id, name, email, securables };
};
