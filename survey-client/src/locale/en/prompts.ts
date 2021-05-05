import { LocaleMessageObject } from 'vue-i18n';

const prompts: LocaleMessageObject = {
  checkbox: {
    label: 'Select any of the options',
    other: 'Please specify',
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
    other: 'Please specify',
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
  mealTime: {
    text: 'Did you have {meal}? If so, when was this?',
    description: '',
    yes: 'Around that time',
    no: 'I did not have {meal}',
    validation: {
      required: 'Please select time you had the meal.',
    },
  },
  portionoption: {
    validation: {
      required: 'Please select how the portion will be measured.',
    },
  },
  mealAdding: {
    yes: 'Add Meal',
    no: 'Abort adding',
    hint: 'hit enter when finished typing',
  },
  editMeal: {
    text: 'Please list everything you had for your {meal}, one item per line.',
    description:
      'For example:<p><ul><li>banana</li><li>crisps</li><li>rice</li><li>tea</li></ul></p>' +
      '  <p>You can press Enter on your keyboard or the "add a food/drink" button to go to the next line as you type.</p>' +
      '  <p><strong>Do not</strong> enter how much you had, just the food names.',
    food: 'Food',
    drinks: 'Drinks',
    addFood: 'Add a food',
    addDrink: 'Add a drink',
    deleteMeal: 'Delete {meal}',
  },
};

export default prompts;
