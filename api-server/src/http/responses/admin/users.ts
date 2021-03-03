import { UserEntry, UserMgmtListEntry, RespondentResponse } from '@common/types/http';
import { User, UserSurveyAlias } from '@/db/models/system';
import { permissionListResponse } from './permissions';

export const userEntryResponse = (user: User): UserEntry => user.get();

export const userRespondentResponse = (alias: UserSurveyAlias): RespondentResponse => {
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
