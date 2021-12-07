import browse from './browse.test';
import read from './read.test';
import createUser from './create-user.test';
import generateUser from './generate-user.test';
import parameters from './parameters.test';
import userInfo from './user-info.test';
import getSession from './get-session.test';
import setSession from './set-session.test';
import followUp from './follow-up.test';

export default () => {
  describe('GET /api/surveys', browse);
  describe('GET /api/surveys/:surveyId', read);
  describe('POST /api/surveys/:surveyId/generate-user', generateUser);
  describe('POST /api/surveys/:surveyId/create-user', createUser);

  describe('GET /api/surveys/:surveyId/parameters', parameters);
  describe('GET /api/surveys/:surveyId/user-info', userInfo);
  describe('GET /api/surveys/:surveyId/session', getSession);
  describe('POST /api/surveys/:surveyId/session', setSession);
  // describe('POST /api/surveys/:surveyId/submissions', submissions);
  describe('GET /api/surveys/:surveyId/follow-up', followUp);
  // describe('POST /api/surveys/:surveyId/request-help', requestHelp);
};
