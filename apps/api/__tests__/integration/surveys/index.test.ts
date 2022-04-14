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
  describe('GET /api/surveys/:slug', read);
  describe('POST /api/surveys/:slug/generate-user', generateUser);
  describe('POST /api/surveys/:slug/create-user', createUser);

  describe('GET /api/surveys/:slug/parameters', parameters);
  describe('GET /api/surveys/:slug/user-info', userInfo);
  describe('GET /api/surveys/:slug/session', getSession);
  describe('POST /api/surveys/:slug/session', setSession);
  // describe('POST /api/surveys/:slug/submissions', submissions);
  describe('GET /api/surveys/:slug/follow-up', followUp);
  // describe('POST /api/surveys/:slug/request-help', requestHelp);
};
