import { LocaleMessageObject } from 'vue-i18n';

const schemes: LocaleMessageObject = {
  _: 'Scheme',
  id: 'Scheme ID',
  index: 'Schemes',
  all: 'All schemes',
  detail: 'Scheme Detail',
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
  'data-export': {
    edit: 'Edit fields',
  },
  questions: {
    title: 'Scheme questions',
    add: 'New question',
    edit: 'Edit question',
    remove: 'Remove question',
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
};

export default schemes;
