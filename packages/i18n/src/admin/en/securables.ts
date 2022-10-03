import type { LocaleMessageObject } from 'vue-i18n';

const securables: LocaleMessageObject = {
  _: 'Security',
  title: 'Security',
  tab: 'Security',

  add: 'Add user access',
  edit: 'Edit user access',
  search: 'Search for user',
  create: 'Create new user',

  owner: {
    _: 'Owner',
    title: 'Ownership',
  },

  actions: {
    _: 'Resource action',
    title: 'Resource actions',
    read: 'Read record',
    edit: 'Edit record',
    delete: 'Delete record',
    copy: 'Copy record',
    securables: 'Security',

    // Feedback scheme
    'top-foods': 'Top foods',
    cards: 'Cards',
    'demographic-groups': 'Demographic groups',
    'henry-coefficients': 'Henry coefficients',

    // Languages
    translations: 'Translations',

    // Locales
    'food-list': 'Food list',
    'split-lists': 'Split lists',
    'split-words': 'Split words',
    'synonym-sets': 'Synonym sets',
    tasks: 'Tasks',

    // Survey scheme
    questions: 'Questions',
    'data-export': 'Data export',

    // Survey
    overrides: 'Overrides',
    respondents: 'Respondents',
    submissions: 'Submissions',
    support: 'Support',
  },
};

export default securables;
