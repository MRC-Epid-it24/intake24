import type { LocaleMessageObject } from 'vue-i18n';

const survey: LocaleMessageObject = {
  _: 'Survey',
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
    429: 'New user has just been generated, please try again later.',
  },
};

export default survey;
