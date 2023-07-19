import type { LocaleMessageObject } from 'vue-i18n';

const languages: LocaleMessageObject = {
  translations: {
    _: 'Invalid language translations array',
    structure: '{attribute} has invalid structure.',
    application: '{attribute} has invalid application type.',
    messages: '{attribute} has invalid messages structure.',
    defaults: '{attribute} has missing default section.',
    keys: '{attribute} has not matching keys with default section.',
  },
};

export default languages;
