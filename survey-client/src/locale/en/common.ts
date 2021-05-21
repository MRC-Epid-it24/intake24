import { LocaleMessageObject } from 'vue-i18n';

const common: LocaleMessageObject = {
  _: 'Intake24 Survey App',
  dashboard: 'Dashboard',
  register: 'Registration',
  login: 'Sign in',
  logout: 'Sign out',

  username: 'Username',
  email: 'Email',
  password: 'Password',

  continue: 'Continue',
  help: 'Help',

  nullString: '# Missing translation!',

  sw: {
    check: 'Content update is available',
    update: 'Update',
  },

  confirm: {
    yes: 'Yes',
    no: 'No',
  },

  errors: {
    expansionIncomplete: 'Please complete all sections marked with !',
  },
};

export default common;
