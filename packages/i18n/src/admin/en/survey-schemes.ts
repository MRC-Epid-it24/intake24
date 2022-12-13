import type { LocaleMessageObject } from 'vue-i18n';

import securables from './securables';

const surveySchemes: LocaleMessageObject = {
  _: 'Survey scheme',
  title: 'Survey schemes',
  all: 'All schemes',
  read: 'Survey scheme detail',
  create: 'Add survey scheme',
  edit: 'Edit survey scheme',
  delete: 'Delete survey scheme',
  load: 'Load from scheme',
  none: 'No survey scheme found',

  copy: {
    _: 'Copy',
    title: 'Copy survey scheme',
    name: 'New survey scheme name',
  },

  types: {
    _: 'Type',
    default: 'Default',
  },

  meals: {
    _: 'Meal',
    title: 'Default meals',
    create: 'New meal',
    edit: 'Edit meal',
    remove: 'Remove meal',
    name: 'Meal name',
    reset: {
      _: 'Reset meals',
      text: 'Reset meals to default list',
    },
    validation: {
      required: 'Meal name must be filled in.',
      unique: 'Meal name already exists in current list.',
    },
  },

  actions: {
    _: 'Action',
    title: 'Actions',
    add: 'New action',
    remove: 'Remove action',
    enable: 'Enable custom prompt actions',
    both: 'Display both layout actions in mobile UI',
    color: 'Color',
    icon: 'Icon',
    label: 'Label',
    text: 'Text',
    layouts: {
      _: 'Layout',
      title: 'Layouts',
      desktop: 'Desktop',
      mobile: 'Mobile',
    },
    types: {
      _: 'Action type',
      title: 'Action types',
      next: 'Next',
      review: 'Review',
      addMeal: 'Add meal',
      deleteFood: 'Delete food',
      deleteMeal: 'Delete meal',
      editMeal: 'Edit meal',
      mealTime: 'Meal time',
    },
  },

  conditions: {
    _: 'Condition',
    title: 'Conditions',
    add: 'New condition',
    remove: 'Remove condition',
    sections: {
      _: 'Section',
      title: 'Sections',
      food: 'Food',
      meal: 'Meal',
      survey: 'Survey',
    },
    types: {
      _: 'Condition type',
      title: 'Condition types',
      promptAnswer: 'Prompt answer',
      recallNumber: 'Recall number',
      drinks: 'Drinks',
      energy: 'Energy',
      foodCategory: 'Food category',
    },
    exTypes: {
      promptAnswer: 'Prompt answer {section}: {promptId}',
      recallNumber: 'Recall number',
      drinks: 'Drinks ({section})',
      energy: 'Energy ({section})',
      foodCategory: 'Food category',
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
  },
  'data-export': {
    _: 'Data export',
    tab: 'Data export',
    title: 'Data export fields',
    current: 'Current export fields',
    available: 'Available export fields',
    edit: 'Edit fields',
    fields: {
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
    _: 'Scheme question',
    tab: 'Questions',
    title: 'Scheme questions',
    create: 'New question',
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
    internal: {
      _: 'Internal identifiers',
      id: {
        _: 'Question ID',
        hint: 'Internal unique identifier, used e.g. in data-exports as header',
      },
      name: {
        _: 'Question Name',
        hint: 'Internal descriptive name for better orientation ',
      },
    },
    type: 'Question type',
    component: 'Question component',
    name: {
      _: 'Question Name',
      hint: 'Short question name (e.g. for breadcrumbs)',
      required: 'Question name is required.',
    },
    text: {
      _: 'Question text',
      hint: 'Main question text',
      required: 'Question text is required.',
    },
    description: {
      _: 'Question description',
      hint: 'Additional question information',
      required: 'Question description is required.',
    },
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
    imageMap: {
      _: 'Image map settings',
      labels: 'Show labels',
      pinchZoom: `Show PinchZoom for mobile UI`,
    },
    label: 'Options list label',
    leftovers: 'Allow leftovers',
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
    templates: {
      _: 'Question Template',
      title: 'Question Templates',
      add: 'Load from template',
      alreadyExists: `Question with ID '{questionId}' already exists in scheme`,
      none: 'No question template found',
      saveAs: {
        _: 'Save as template',
        title: 'Save question as template',
      },
    },
  },
  overrides: {
    _: 'Scheme overrides',
    meals: {
      title: 'Scheme meals overrides',
      subtitle:
        'Override scheme meal list. If left empty, scheme list is used. If any item added, whole list is used.',
    },
    questions: {
      title: 'Scheme questions overrides',
      subtitle: 'Override specific scheme question prompt. Changes will get merged by Question ID.',
    },
  },
  foodSearch: {
    allowBrowsing: 'Allow respondents to search for foods by freely browsing food categories',
    dualLanguage: 'Display alternative food names in another language',
  },
  redirect: {
    url: {
      _: 'Base URL',
      title: 'URL Options',
      subtitle: `Use '{identifier}' to indicate the place where user identifier should be to inserted.`,
      hint: 'https://example.com/?arg={identifier}',
    },
    identifier: {
      _: 'User identifier to embed into the URL',
      subtitle: 'Specify which identifier to embed into the redirect URL',
      options: {
        userId: 'User ID',
        username: 'Username',
        token: 'Authentication token',
        custom: 'Custom field',
      },
    },
    timer: {
      _: 'Number of seconds for redirect',
      title: 'Timer options',
    },
  },
  prompts: {
    // Standard
    'associated-foods-prompt': {
      title: 'Associated foods',
      subtitle: 'Suggest foods typically consumed together',
    },
    'edit-meal-prompt': {
      title: 'Food list',
      subtitle: 'List or edit foods in this meal as free text descriptions',
    },
    'final-prompt': {
      title: 'Final',
      subtitle: 'Final page after submission',
    },
    'food-search-prompt': {
      title: 'Food database search',
      subtitle: 'Choose a food from the database that best matches the description',
    },
    'meal-add-prompt': {
      title: 'Add meal',
      subtitle: 'Add a new meal to the meal list',
    },
    'meal-time-prompt': {
      title: 'Meal time',
      subtitle: 'Confirm the time of the meal or remove the meal',
    },
    'ready-meal-prompt': {
      title: 'Ready meal',
      subtitle: 'Ask about ready meals',
    },
    'redirect-prompt': {
      title: 'Redirect',
      subtitle: 'Final page for user redirect to external site',
    },
    'review-confirm-prompt': {
      title: 'Review and Confirm',
      subtitle: 'Review and Confirm completion and progress of the recall',
    },
    'same-as-before-prompt': {
      title: 'Same as before',
      subtitle: 'Ask if food was same as before',
    },
    'split-food-prompt': {
      title: 'Split food',
      subtitle: 'Ask for split food description',
    },
    'submit-prompt': {
      title: 'Submit',
      subtitle: 'Confirm completion and submit recall',
    },
    // Custom
    'info-prompt': {
      title: 'Information',
      subtitle: 'Show a message or instructions and ask for confirmation',
    },
    'no-more-information-prompt': {
      title: 'No More Information',
      subtitle: 'Show a message that no more information needed for the current selection',
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
    'yes-no-prompt': {
      title: 'Yes / No choice',
      subtitle: 'Ask to choose yes or no',
    },
    // Portion sizes
    'as-served-prompt': {
      title: 'As served portion size',
      subtitle: 'Use the "as served" method to estimate the portion size',
    },
    'cereal-prompt': {
      title: 'Cereal',
      subtitle: 'Use the "cereal" method to estimate the portion size',
    },
    'direct-weight-prompt': {
      title: 'Direct weight',
      subtitle: 'Direct weight',
    },
    'drink-scale-prompt': {
      title: 'Drink Scale',
      subtitle: 'Use the "drink scale" method to estimate the amount of liquid consumed',
    },
    'guide-image-prompt': {
      title: 'Guide image',
      subtitle: 'Use the "guide image" method to estimate the portion size',
    },
    'milk-in-a-hot-drink-prompt': {
      title: 'Milk in a hot drink',
      subtitle: 'Use the "milk in a hot drink" method to estimate the amount of milk',
    },
    'milk-on-cereal-prompt': {
      title: 'Milk on cereal',
      subtitle: 'Use the "milk on cereal" method to estimate the portion size',
    },
    'pizza-prompt': {
      title: 'Pizza',
      subtitle: 'Use the "pizza" method to estimate the portion size',
    },
    'portion-size-option-prompt': {
      title: 'Portion size estimation method',
      subtitle:
        'Choose which portion size method to use in case more than one is available for the food',
    },
    'standard-portion-prompt': {
      title: 'Standard portion',
      subtitle: 'Use the "standard portion" method to estimate the portion size',
    },
  },

  securables,
};

export default surveySchemes;
