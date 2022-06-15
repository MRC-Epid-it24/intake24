import type { LocaleMessageObject } from 'vue-i18n';

const survey: LocaleMessageObject = {
  _: 'Survey',
  generateUser: {
    _: 'Generate access',
    403: `Survey {surveyId} doesn't allow user generation.`,
    404: `Survey {surveyId} hasn't been recognized.`,
    422: 'Invalid reCaptcha provided.',
    429: 'New user has just been generated, please try again later.',
  },
};

export default survey;
