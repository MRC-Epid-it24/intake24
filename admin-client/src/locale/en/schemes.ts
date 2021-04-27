import { LocaleMessageObject } from 'vue-i18n';
import {
  basePromptProps,
  checkboxListPromptProps,
  datePickerPromptProps,
  radioListPromptProps,
  textareaPromptProps,
  timePickerPromptProps,
} from '@common/prompts';

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
      promptAnswer: 'Prompt answer',
      recallNumber: 'Recall number',
    },
    exTypes: {
      promptAnswer: 'Prompt ({promptId}) answer',
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
      title: 'Pre-meals questions',
      subtitle: 'Questions asked before meals selection',
    },
    postMeals: {
      title: 'Post-meals questions',
      subtitle: 'Questions asked after meals selection',
    },
    submission: {
      title: 'Submission questions',
      subtitle: 'Questions asked before submission',
    },
    preFoods: {
      title: 'Pre-foods questions',
      subtitle: 'Questions asked before foods selection',
    },
    foods: {
      title: 'Foods questions',
      subtitle: 'Questions asked during foods selection',
    },
    postFoods: {
      title: 'Post-foods questions',
      subtitle: 'Questions asked before foods selection',
    },
    id: 'Question ID',
    name: 'Question name',
    component: 'Question type',
    text: 'Question text',
    description: 'Question description',
    label: 'Options list label',
    other: 'Allow custom other option',
    noStandardQuestions: 'No standard questions available for this section',
    noCustomQuestions: 'No custom questions available for this section',
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
  prompts: {
    'meal-time-prompt': {
      title: 'Meal time',
      subtitle: 'Confirm meal and its time or remove meal',
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
  },
};

export default schemes;
