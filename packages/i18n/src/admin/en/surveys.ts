import type { LocaleMessageObject } from 'vue-i18n';
import securables from './securables';

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
    notStarted: 'Not started',
    active: 'Active',
    suspended: 'Suspended',
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
  users: {
    _: 'Users settings',
    allowGenUsers: 'Allow user generation',
    genUserKey: 'JWT secret for user generation',
    personalIdentifiers: 'Allow user personal identifiers',
    customFields: 'Allow user custom fields',
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
    numberOfSubmissions: 'Number of submissions for feedback',
  },
  'data-export': {
    _: 'Data export',
    tab: 'Data export',
    title: 'Data Export options',
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
      surveyAuthUrl: 'Survey URL',
      feedbackAuthUrl: 'Feedback URL',
      copiedToClipboard: 'URL copied to clipboard.',
    },
    feedback: {
      _: 'Feedback',
      title: `Respondent's feedback`,
      details: 'Respondent details',
      open: `Open`,
      download: `Download`,
      email: {
        title: 'Email feedback to respondent',
        recipient: 'Recipient email',
        sent: 'Send',
        copy: {
          _: 'Copy me: ',
          cc: 'CC',
          bcc: 'BCC',
          none: 'None',
        },
      },
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

  securables,
};

export default surveys;
