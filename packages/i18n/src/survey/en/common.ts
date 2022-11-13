import type { LocaleMessageObject } from 'vue-i18n';

const common: LocaleMessageObject = {
  _: 'Intake24',
  home: 'Home',
  dashboard: 'Dashboard',
  welcome: {
    _: 'Welcome to Intake24',
    subtitle:
      'Intake24 is an open-source self-completed computerised dietary recall system based on multiple-pass 24-hour recall.',
  },
  login: {
    _: 'Sign in',
    subtitle: 'Sign in with your username & password',
    back: 'Back to login',

    err: {
      invalidCredentials: 'Invalid username & password credentials provided.',
      invalidToken: 'Invalid access token provided.',
      invalidSurvey: "This survey ({surveyId}) doesn't look like to be a valid survey login URL.",
      checkCredentials: 'Please check your provided login credentials.',
    },
  },
  logout: {
    _: 'Sign out',
    text: 'Sign out of the application',
  },

  username: 'Username',
  name: 'Name',
  email: 'Email',
  emailConfirm: 'Confirm email',
  password: 'Password',
  phone: 'Phone',
  continue: 'Continue',

  help: {
    _: 'Help',
    title: 'Request help',
    sent: 'Your help request has been sent.',
  },

  app: {
    _: 'App',
    info: 'Application Information',
    build: 'Build',
  },

  clipboard: {
    _: 'Copy to clipboard',
    copied: 'Data copied to clipboard',
  },

  sw: {
    check: 'Content update is available',
    update: 'Update',
  },

  action: {
    cancel: 'Cancel',
    close: 'Close',
    continue: 'Continue',
    confirm: {
      _: 'Confirm',
      title: 'Do you want to continue?',
      delete: `Do you want to delete {name}?`,
      yes: 'Yes',
      no: 'No',
    },
    ok: 'OK',
    reload: 'Reload',
    remove: 'Remove',
    reset: 'Reset',
    start: 'Start',
    submit: 'Submit',
    yes: 'Yes',
    no: 'No',
  },

  not: {
    provided: 'Not provided',
    selected: 'Not selected',
  },

  errors: {
    expansionIncomplete: 'Please complete all sections marked with !',
  },
};

export default common;
