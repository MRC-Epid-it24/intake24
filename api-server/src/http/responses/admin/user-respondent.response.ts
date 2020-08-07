import { RespondentResponse } from '@common/types/api/admin/users';
import { UserSurveyAlias } from '@/db/models/system';

export default (alias: UserSurveyAlias): RespondentResponse => {
  const {
    userId,
    userName,
    surveyId,
    user: { name = null, email = null, phone = null } = {},
  } = alias;

  return {
    userId,
    userName,
    surveyId,
    name,
    email,
    phone,
  } as RespondentResponse;
};
