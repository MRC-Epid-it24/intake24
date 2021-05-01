import { LocaleMessageObject } from 'vue-i18n';

const schemes: LocaleMessageObject = {
  _: 'Scheme',
  id: 'Scheme ID',
  index: 'Schemes',
  all: 'All schemes',
  detail: 'Scheme detail',
  new: 'New scheme',
  create: 'Add scheme',
  edit: 'Edit scheme',
  delete: 'Delete scheme',

  name: 'Name',
  types: {
    _: 'Type',
    legacy: 'Legacy survey scheme',
    'data-driven': 'Data-driven survey scheme',
  },
  meals: {
    _: 'Meal',
    title: 'Default meals',
    add: 'New meal',
    edit: 'Edit meal',
    remove: 'Remove meal',
    reset: 'Reset meals to default values',
    validation: {
      required: 'Meal name must be filled in.',
      unique: 'Meal name already exists in current list.',
    },
  },
  conditions: {
    _: 'Condition',
    title: 'Conditions',
    new: 'New condition',
    edit: 'Edit condition',
    types: {
      _: 'Condition type',
      title: 'Condition types',
      surveyPromptAnswer: 'Survey prompt answer',
      mealPromptAnswer: 'Meal prompt answer',
      foodPromptAnswer: 'Food prompt answer',
      recallNumber: 'Recall number',
    },
    exTypes: {
      surveyPromptAnswer: 'Survey question answer: {promptId}',
      mealPromptAnswer: 'Meal question answer: {promptId}',
      foodPromptAnswer: 'Food question answer: {promptId}',
      recallNumber: 'Recall number',
    },
    ops: {
      _: 'Operation',
      eq: 'equal',
      ne: 'not equal',
      gte: 'greater than or equal to',
      gt: 'greater than',
      lte: 'less than or equal to',
      lt: 'less than',
    },
    value: 'Condition value',
    promptId: 'Prompt ID',
    showIf: 'Show prompt if: ',
    remove: 'Remove condition',
  },
  'data-export': {
    _: 'Data export',
    title: 'Data export fields',
    edit: 'Edit fields',
    field: {
      _: 'Edit field label',
      id: 'Field ID',
      label: 'Field label',
    },
    sections: {
      _: 'Data export sections',
      user: 'User record fields',
      userCustom: 'User custom fields',
      survey: 'Survey record fields',
      surveyCustom: 'Survey custom fields',
      meal: 'Meal record fields',
      mealCustom: 'Meal custom fields',
      food: 'Food record fields',
      foodCustom: 'Food custom fields',
      foodFields: 'Food composition fields',
      foodNutrients: 'Food nutrient fields',
      portionSizes: 'Portion size fields',
    },
  },
  questions: {
    title: 'Scheme questions',
    add: 'New question',
    edit: 'Edit question',
    move: 'Move question',
    remove: 'Remove question',
    section: 'Questions section',
    preMeals: {
      title: 'Pre-recall questions',
      subtitle:
        'General questions asked before the dietary recall, including personal questions and the initial instructions.',
    },
    postMeals: {
      title: 'Post-recall questions',
      subtitle: 'General questions asked after the dietary recall.',
    },
    submission: {
      title: 'Submission questions',
      subtitle: 'Final questions asked before the submission.',
    },
    preFoods: {
      title: 'Pre-foods meal questions',
      subtitle: 'Questions asked about meals before foods are entered, such as the meal time.',
    },
    foods: {
      title: 'Food questions',
      subtitle:
        'Questions asked about foods, including food database search and portion size estimation.',
    },
    postFoods: {
      title: 'Post-foods meal questions',
      subtitle:
        'Questions asked about meals after the portion size estimation is complete for all foods in the meal.',
    },
    id: 'Question ID',
    name: 'Question name',
    component: 'Question component',
    type: 'Question type',
    custom: {
      _: 'Custom',
      noQuestions: 'No custom questions available for this section',
    },
    standard: {
      _: 'Standard',
      noQuestions: 'No standard questions available for this section',
    },
    'portion-size': {
      _: 'Portion size',
      noQuestions: 'No portion size questions available for this section',
    },
    text: 'Question text',
    description: 'Question description',
    label: 'Options list label',
    other: 'Allow custom other option',
    orientation: {
      _: 'Orientation',
      column: 'Column',
      row: 'Row',
    },
    options: {
      _: 'Options',
      title: 'Option list',
      add: 'New option',
      remove: 'Remove option',
      label: 'Label',
      value: 'Value',
    },
    validation: {
      required: 'Question is required to be filled in',
      message: 'Error message to be displayed',
    },
  },
  foodSearch: {
    allowBrowsing: 'Allow respondents to search for foods by freely browsing food categories',
    dualLanguage: 'Display alternative food names in another language',
  },
  prompts: {
    'meal-time-prompt': {
      title: 'Meal time',
      subtitle: 'Confirm the time of the meal or remove the meal',
    },
    'meal-add-prompt': {
      title: 'Add meal',
      subtitle: 'Add a new meal to the meal list',
    },
    'edit-meal-prompt': {
      title: 'Food list',
      subtitle: 'List or edit foods in this meal as free text descriptions',
    },
    'submit-prompt': {
      title: 'Submit',
      subtitle: 'Confirm completion and submit recall',
    },
    'info-prompt': {
      title: 'Information',
      subtitle: 'Show a message or instructions and ask for confirmation',
    },
    'date-picker-prompt': {
      title: 'Date',
      subtitle: 'Ask to choose a date',
    },
    'time-picker-prompt': {
      title: 'Time',
      subtitle: 'Ask to choose a time of day',
    },
    'checkbox-list-prompt': {
      title: 'Multiple choice',
      subtitle: 'Ask to choose any number of items from a list',
    },
    'radio-list-prompt': {
      title: 'Single choice',
      subtitle: 'Ask to choose one item from a list',
    },
    'textarea-prompt': {
      title: 'Free text',
      subtitle: 'Ask to enter a free text answer or description',
    },
    'food-search-prompt': {
      title: 'Food database search',
      subtitle: 'Choose a food from the database that best matches the description',
    },
    'portion-size-option-prompt': {
      title: 'Portion size estimation method',
      subtitle:
        'Choose which portion size method to use in case more than one is available for the food',
    },
    'as-served-prompt': {
      title: 'As served portion size',
      subtitle: 'Use the "as served" method to estimate the weight of the food',
    },
    'as-served-leftovers-prompt': {
      title: 'As served leftovers',
      subtitle: 'Use the "as served" method to estimate the weight of leftovers',
    },
  },
};

export default schemes;
