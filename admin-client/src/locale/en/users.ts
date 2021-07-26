import { LocaleMessageObject } from 'vue-i18n';

const users: LocaleMessageObject = {
  _: 'User',
  title: 'Users',
  all: 'All users',
  read: 'User detail',
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
    changed: 'Password has been changed.',
    reset: {
      _: 'Reset password',
      recaptcha: 'Invalid reCAPTCHA challenge',
      send: 'Send request',
      sent: 'Link to restore your password has been sent to provided email address.',
    },
  },
  email: 'Email',
  phone: 'Phone',
  aliases: {
    _: 'User alias',
    title: 'User aliases',
    surveyId: 'Survey ID',
    userName: 'Username',
    urlAuthToken: 'URL Auth Token',
    none: 'No survey alias defined',
  },
  customFields: {
    _: 'Custom field',
    title: 'Custom fields',
    name: 'Field name',
    value: 'Fields value',
    none: 'No custom field defined',
  },
  permissions: {
    _: 'Assigned permissions',
    hint: 'Prefer permission assignment through role rather than direct permission assignment.',
  },
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
