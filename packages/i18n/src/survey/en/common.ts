import { LocaleMessageObject } from 'vue-i18n';

const common: LocaleMessageObject = {
  _: 'Intake24',
  dashboard: 'Dashboard',
  register: 'Registration',
  login: 'Sign in',
  logout: {
    _: 'Sign out',
    text: 'Sign out of the application',
  },

  username: 'Username',
  email: 'Email',
  emailConfirm: 'Confirm email',
  password: 'Password',

  help: 'Help',

  nullString: '# Missing translation!',

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
