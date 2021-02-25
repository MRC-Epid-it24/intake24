import { LocaleMessage } from 'vue-i18n';

const portion: LocaleMessage = {
  option: {
    // Implementation of this needs looking at for RTL
    label: 'How would you like to estimate the portion size of your',
    validation: {
      required: 'Please select how the portion will be measured.',
    },
    imageInvalid: 'Image loading',
  },
};

export default portion;
