import { LocaleMessageObject } from 'vue-i18n';

const feedbackSchemes: LocaleMessageObject = {
  _: 'Feedback scheme',
  title: 'Feedback schemes',
  read: 'Feedback scheme detail',
  create: 'Add feedback scheme',
  edit: 'Edit feedback scheme',
  delete: 'Delete feedback scheme',
  none: 'No feedback scheme found',

  name: 'Name',

  copy: {
    _: 'Copy',
    title: 'Copy feedback scheme',
    name: 'New feedback scheme name',
  },

  types: {
    _: 'Feedback type',
    title: 'Feedback types',
    default: 'Default',
    playful: 'Playful',
  },

  'top-foods': {
    _: 'Top food',
    title: 'Top foods',
    tab: 'Top foods',
    max: {
      _: 'Foods number',
      title: 'Number of foods',
      required: 'Value must be an integer',
    },
    colors: {
      _: 'Color',
      title: 'Color list',
      edit: 'Edit color',
      other: 'Other food',
    },
    nutrientTypes: {
      _: 'Nutrient type',
      title: 'Nutrient types',
      create: 'Add nutrient type',
      edit: 'Edit nutrient type',
      remove: 'Remove nutrient type',
      label: 'Nutrient type label',
      reset: {
        _: 'Reset nutrient types',
        text: 'Reset nutrient types to default list',
      },
      validation: {
        required: 'Nutrient type must be filled in.',
        unique: 'Nutrient type already exists in current list.',
      },
    },
  },

  'food-groups': {
    _: 'Food group',
    title: 'Food groups',
    tab: 'Food groups',
  },
};

export default feedbackSchemes;
