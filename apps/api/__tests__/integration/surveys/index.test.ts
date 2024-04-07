import browse from './browse.test';
import createUser from './create-user.test';
import generateUser from './generate-user.test';
import getSession from './get-session.test';
import parameters from './parameters.test';
import rating from './rating.test';
import read from './read.test';
import requestHelp from './request-help.test';
import setSession from './set-session.test';
import userInfo from './user-info.test';

export default () => {
  describe('get /api/surveys', browse);
  describe('get /api/surveys/:slug', read);
  describe('pOST /api/surveys/:slug/generate-user', generateUser);
  describe('pOST /api/surveys/:slug/create-user', createUser);

  describe('get /api/surveys/:slug/parameters', parameters);
  describe('get /api/surveys/:slug/user-info', userInfo);
  describe('get /api/surveys/:slug/session', getSession);
  describe('pOST /api/surveys/:slug/session', setSession);
  // describe('POST /api/surveys/:slug/submission', submission);
  describe('pOST /api/surveys/:slug/rating', rating);
  describe('pOST /api/surveys/:slug/request-help', requestHelp);
};
