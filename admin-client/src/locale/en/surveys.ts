import { LocaleMessageObject } from 'vue-i18n';

const surveys: LocaleMessageObject = {
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
  'data-export': {
    _: 'Data export',
  },
  mgmt: {
    _: 'Management',
    title: 'Survey management',
    add: 'New staff/support',
    edit: 'Edit staff',
  },
  respondents: {
    _: 'Respondents',
    title: 'Survey respondents',
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
  submissions: {
    _: 'Submissions',
    title: 'Survey submissions',
    id: 'Submission ID',
    userId: 'User ID',
    startTime: 'Start Time',
    endTime: 'End Time',
    submissionTime: 'Submission Time',
  },
};

export default surveys;
