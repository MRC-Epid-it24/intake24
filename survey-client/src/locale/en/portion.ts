import { LocaleMessage } from 'vue-i18n';

const portion: LocaleMessage = {
  common: {
    backStep: 'Go back to previous step',
  },
  option: {
    // Implementation of this needs looking at for RTL
    label: 'How would you like to estimate the portion size of your',
    validation: {
      required: 'Please select how the portion will be measured.',
    },
    imageInvalid: 'Image loading',
  },
  asServed: {
    label: 'Using these pictures, please chose how much you had'
  }
};

export default portion;
