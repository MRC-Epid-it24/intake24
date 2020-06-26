import { LocaleMessage } from 'vue-i18n';

const surveys: LocaleMessage = {
  _: 'Survey',
  id: 'Survey ID',
  index: 'Surveys',
  all: 'All surveys',
  detail: 'Survey Detail',
  new: 'New survey',
  create: 'Add survey',
  edit: 'Edit survey',
  delete: 'Delete survey',

  locale: 'Locale',
  scheme: 'Scheme',
  state: {
    _: 'State',
    0: 'Not started',
    1: 'Active',
    2: 'Suspended',
  },
  startDate: 'Start date',
  endDate: 'End date',
  supportEmail: 'Support Email',
  allowGenUsers: 'Allow generation of users',
  storeUserSessionOnServer: 'Store user session on server',
  feedback: {
    _: 'Feedback',
    enabled: 'Enabled',
    numberOfSubmissions: 'Number of submissions',
  },
};

export default surveys;
