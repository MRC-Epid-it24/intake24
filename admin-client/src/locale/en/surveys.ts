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
  authUrlDomainOverride: 'Authentication URL domain override',
  genUsers: {
    allow: 'Allow user generation',
    secret: 'JWT secret for user generation',
  },
  submissionLimits: {
    _: 'Submission limits',
    maxDaily: 'Maximum allowed submissions per calendar day',
    maxTotal: 'Maximum allowed total submissions',
    minInterval: 'Minimum interval between submissions (seconds)',
  },
  storeUserSessionOnServer: 'Store user session on server',
  feedback: {
    _: 'Feedback settings',
    enabled: 'Feedback Enabled',
    numberOfSubmissions: 'Number of submissions for feedback',
  },

  respondents: {
    _: 'Survey respondents',
    add: 'New respondent',
    edit: 'Edit respondent',
    upload: {
      _: 'Respondents upload',
      title: 'Survey respondents bulk upload',
      file: 'Browse CSV File',
      submit: 'Upload',
    },
    authUrls: {
      _: 'Authentication URLs',
      title: 'Survey respondents authentication URLs',
      submit: 'Generate file',
      download: 'Download',
    },
  },
  mgmt: {
    _: 'Survey management',
    add: 'New staff/support',
    edit: 'Edit staff',
  },
};

export default surveys;
