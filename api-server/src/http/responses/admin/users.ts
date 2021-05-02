import { UserEntry, UserMgmtListEntry, RespondentEntry } from '@common/types/http/admin';
import { User, UserSurveyAlias } from '@/db/models/system';
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

export const userRespondentResponse = (alias: UserSurveyAlias): RespondentEntry => {
  const {
    userId,
    userName,
    surveyId,
    user: { name = null, email = null, phone = null } = {},
  } = alias;

  return { userId, userName, surveyId, name, email, phone };
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
