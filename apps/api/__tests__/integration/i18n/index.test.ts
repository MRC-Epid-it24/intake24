import browse from './browse.test';
import entry from './entry.test';

export default () => {
  describe('GET /api/i18n', browse);
  describe('GET /api/i18n/:languageId', entry);
};
