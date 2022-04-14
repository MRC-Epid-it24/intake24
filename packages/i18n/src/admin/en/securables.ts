import { LocaleMessageObject } from 'vue-i18n';

const securables: LocaleMessageObject = {
  _: 'Security',
  title: 'Security',
  tab: 'Security',

  add: 'Add user access',
  edit: 'Edit user access',
  search: 'Search for user',
  create: 'Create new user',

  actions: {
    _: 'Resource action',
    title: 'Resource actions',
    read: 'Read record',
    edit: 'Edit record',
    delete: 'Delete record',
    securables: 'Security',

    // Feedback scheme
    'top-foods': 'Top foods',
    cards: 'Cards',
    'demographic-groups': 'Demographic groups',
    'henry-coefficients': 'Henry coefficients',

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
