import browse from './browse.test';
import entry from './entry.test';

export default () => {
  describe('get /api/i18n', browse);
  describe('get /api/i18n/:languageId', entry);
};
