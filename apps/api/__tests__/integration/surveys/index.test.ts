import browse from './browse.test';
import clearSession from './clear-session.test';
import createUser from './create-user.test';
import foodSearch from './food-search.test';
import generateUser from './generate-user.test';
import getSession from './get-session.test';
import parameters from './parameters.test';
import rating from './rating.test';
import read from './read.test';
import requestHelp from './request-help.test';
import saveSession from './save-session.test';
import startSession from './start-session.test';
import userInfo from './user-info.test';

export default () => {
  describe('get /api/surveys', browse);
  describe('get /api/surveys/:slug', read);
  describe('post /api/surveys/:slug/generate-user', generateUser);
  describe('post /api/surveys/:slug/create-user', createUser);

  describe('get /api/surveys/:slug/parameters', parameters);
  describe('get /api/surveys/:slug/user-info', userInfo);
  describe('get /api/surveys/:slug/session', getSession);
  describe('post /api/surveys/:slug/session', startSession);
  describe('put /api/surveys/:slug/session', saveSession);
  describe('delete /api/surveys/:slug/session', clearSession);
  // describe('POST /api/surveys/:slug/submission', submission);
  describe('post /api/surveys/:slug/rating', rating);
  describe('post /api/surveys/:slug/request-help', requestHelp);
  describe('get /api/surveys/:slug/search', foodSearch);
};
