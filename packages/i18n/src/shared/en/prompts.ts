import type { LocaleMessageObject } from 'vue-i18n';

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
    // description: 'Placeholder',
    yes: 'Around that time',
    no: 'I did not have {meal}',
    validation: {
      required: 'Please select time you had the meal.',
    },
  },
  portionOption: {
    validation: {
      required: 'Please select how the portion will be measured.',
    },
  },
  addMeal: {
    label: 'Select or enter meal name',
    yes: 'Add Meal',
    no: 'Abort adding',
    hint: 'hit enter when finished typing',
    noMeal: 'No Meals remaining, please add at least one',
  },
  mealDelete: {
    title: 'Delete Meal/Food',
    message: 'Do you want to delete {meal}',
  },
  editMeal: {
    text: 'Please list everything you had for your {meal}, one item per line.',
    description: `For example:<p><ul><li>banana</li><li>crisps</li><li>rice</li><li>tea</li></ul></p>
      <p>You can press Enter on your keyboard or the "add a food/drink" button to go to the next line as you type.</p>
      <p><strong>Do not</strong> enter how much you had, just the food names.`,
    food: 'Your food and drinks',
    drinks: 'Drinks',
    addFood: 'Add',
    addDrink: 'Add a drink',
    deleteMeal: 'Delete {meal}',
    deleteFoodFromMeal: 'Delete {food}',
    editMeal: 'Edit {meal}',
    editTime: 'Change Time',
  },
  associatedFoods: {
    text: 'Did you have any of these with your {food}?',
    description: 'These foods are often consumed together.',
    yes: 'Yes, I had some',
    no: 'No, I did not',
    alreadyEntered: 'Yes, already entered',
  },
  noMoreInfo: {
    meal: {
      text: 'No more information needed',
      description: `<p>We have all the information that we need regarding your <strong>{item}</strong> at this time.</p>
        <p>To continue with the survey, click the "Continue" button below and we will automatically select the next food or meal that we still need some information about.</p>
        <p>Alternatively, click on a meal or food on the left if you would like to focus on a particular item.</p>`,
    },
    food: {
      text: 'No more information needed',
      description: `<p>We have all the information that we need about your <strong>{item}</strong> at this time.</p>
        <p>To continue with the survey, click "Continue" below and we will automatically select the next food or meal that we still need information about.</p>
        <p>Alternatively, click on a meal or food on the left if you would like to focus on a particular item.</p>`,
    },
  },
};

export default prompts;
