import type { LocaleMessageObject } from 'vue-i18n';

const survey: LocaleMessageObject = {
  _: 'Survey',
  info: 'Survey information',
  states: {
    _: 'Status',
    notStarted: 'Data collection has not started.',
    active: 'Data collection is in progress.',
    suspended: 'Data collection is suspended.',
    completed: 'Data collection is completed.',
  },
  openAccess: {
    _: 'Open access studies',
    none: {
      _: 'No open access studies',
      subtitle: 'There are not open access studies available at the moment.',
    },
  },
  generateUser: {
    _: 'Generate access',
    subtitle: 'This is open access study, you can get free access.',
    403: `Survey {surveyId} doesn't allow user generation.`,
    404: `Survey {surveyId} hasn't been recognized.`,
    422: 'Invalid captcha provided.',
    429: 'New user has just been generated, try again later.',
  },
};

export default survey;
