import { LocaleMessageObject } from 'vue-i18n';

const surveys: LocaleMessageObject = {
  _: 'Survey',
  title: 'Surveys',
  all: 'All surveys',
  read: 'Survey detail',
  create: 'Add survey',
  edit: 'Edit survey',
  delete: 'Delete survey',

  id: 'Survey ID',
  name: 'Survey name',
  states: {
    _: 'State',
    0: 'Not started',
    1: 'Active',
    2: 'Suspended',
  },
  startDate: 'Start date',
  endDate: 'End date',
  supportEmail: 'Support Email',
  authUrl: {
    _: 'Authentication URL settings',
    domainOverride: 'Domain override',
    tokenCharset: 'Token character set',
    tokenLength: 'Token length',
  },
  genUsers: {
    _: 'User generation settings',
    allow: 'Allow user generation',
    secret: 'JWT secret for user generation',
  },
  search: {
    _: 'Search options',
    sortingAlgorithm: 'Sorting algorithm',
    matchScoreWeight: 'Match score weight',
    algorithms: {
      paRules: 'Pairwise associations (machine learning)',
      popularity: 'Popularity (reporting frequency)',
      globalPop: 'Global popularity (reporting frequency)',
      fixed: 'Predetermined order',
    },
  },
  submissionLimits: {
    _: 'Submission limits',
    maxDaily: 'Maximum allowed submissions per calendar day',
    maxTotal: 'Maximum allowed total submissions',
    minInterval: 'Minimum interval between submissions (seconds)',
  },
  suspensionReason: 'Suspension reason',
  storeUserSessionOnServer: 'Store user session on server',
  submissionNotificationUrl: 'Submission notification URL',
  feedback: {
    _: 'Feedback settings',
    enabled: 'Feedback enabled',
    styles: {
      _: 'Feedback style',
      default: 'Default',
    },
    numberOfSubmissions: 'Number of submissions for feedback',
  },
  'data-export': {
    _: 'Data export',
    tab: 'Data export',
    title: 'Data Export options',
  },
  mgmt: {
    _: 'Management',
    tab: 'Management',
    title: 'Survey management',
    add: 'New staff / support',
    edit: 'Edit staff access',
    search: 'Search for user',
    create: 'Create new user',
  },
  overrides: {
    _: 'Scheme overrides',
    tab: 'Overrides',
    title: 'Scheme overrides',
  },
  respondents: {
    _: 'Respondent',
    tab: 'Respondents',
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
    _: 'Submission',
    tab: 'Submissions',
    title: 'Survey submissions',
    id: 'Submission ID',
    userId: 'User ID',
    startTime: 'Start Time',
    endTime: 'End Time',
    submissionTime: 'Submission Time',
  },
};

export default surveys;
