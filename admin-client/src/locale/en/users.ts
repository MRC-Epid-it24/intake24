import { LocaleMessage } from 'vue-i18n';

const users: LocaleMessage = {
  _: 'User',
  index: 'Users',
  all: 'All users',
  detail: 'User Detail',
  new: 'New user',
  create: 'Add user',
  edit: 'Edit user',
  delete: 'Delete user',

  name: 'Name',
  simpleName: 'Simple name',
  username: 'Username',
  password: {
    _: 'Password',
    current: 'Current password',
    new: 'New password',
    confirm: 'Confirm password',
    forgot: 'Forgotten password?',
    change: 'Change current password',
    changed: 'Password has been changed',
    reset: {
      _: 'Reset password',
      recaptcha: 'Invalid reCAPTCHA challenge',
      send: 'Send request',
      sent: 'Link to restore your password has been sent to the provided email address.',
    },
  },
  email: 'Email',
  phone: 'Phone',
  roles: 'Assigned roles',

  mfa: {
    _: 'Multi-factor authentication',
    abbr: '2FA',
  },

  notifications: {
    email: 'Email notifications',
    sms: 'SMS notifications',
  },
};

export default users;
