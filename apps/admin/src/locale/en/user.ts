import { LocaleMessageObject } from 'vue-i18n';

const user: LocaleMessageObject = {
  _: 'Profile',
  title: 'Profile',
  info: 'Information',
  access: 'Access',
  settings: 'Settings',

  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  permissions: 'Assigned permissions',
  roles: 'Assigned roles',

  password: {
    _: 'Password',
    change: 'Change password',
    current: 'Current password',
    new: 'New password',
    confirm: 'Confirm new password',
    update: 'Update password',
    updated: 'Your password has been successfully updated.',
  },

  languages: {
    _: 'Language',
    title: 'Languages',

    ar: 'Arabic',
    de: 'German',
    dk: 'Danish',
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    pt: 'Portuguese',
  },
};

export default user;
