import { LocaleMessageObject } from 'vue-i18n';

const common: LocaleMessageObject = {
  _: 'Intake24 Survey App',
  dashboard: 'Dashboard',
  register: 'Registration',
  login: 'Sign in',
  logout: {
    _: 'Sign out',
    text: 'Sign out of the application',
  },

  username: 'Username',
  email: 'Email',
  password: 'Password',

  help: 'Help',

  nullString: '# Missing translation!',

  sw: {
    check: 'Content update is available',
    update: 'Update',
  },

  cancel: 'Cancel',
  continue: 'Continue',
  confirm: {
    _: 'Confirm',
    title: 'Do you want to continue?',
    delete: `Do you want to delete {name}?`,
    yes: 'Yes',
    no: 'No',
  },

  errors: {
    expansionIncomplete: 'Please complete all sections marked with !',
  },
};

export default common;
