import { LocaleMessage } from 'vue-i18n';

const prompts: LocaleMessage = {
  checkbox: {
    label: 'Select any of the options',
    validation: {
      required: 'At least one of the options requires to be selected.',
    },
  },
  datepicker: {
    validation: {
      required: 'This field is required to be filled in.',
    },
  },
  radio: {
    label: 'Select one of the options',
    validation: {
      required: 'One of the options requires to be selected.',
    },
  },
  textarea: {
    label: 'Please enter your answer in textarea',
    validation: {
      required: 'This field is required to be filled in.',
    },
  },
  timepicker: {
    validation: {
      required: 'This field is required to be filled in.',
    },
  },
  portionoption: {
    validation: {
      required: 'Please select how the portion will be measured.'
    }
  }
};

export default prompts;
