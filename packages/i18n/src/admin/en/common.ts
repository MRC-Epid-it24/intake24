import type { LocaleMessageObject } from 'vue-i18n';

const common: LocaleMessageObject = {
  _: 'Intake24 Admin Tool',
  title: 'Common',
  login: {
    _: 'Sign in',
    subtitle: 'Sign in to Intake24 Admin Tool account',
    back: 'Back to login',
  },
  logout: {
    _: 'Sign out',
    text: 'Sign out from application',
  },
  signup: {
    _: 'Sign Up',
    subtitle: 'Sign up for a new Intake24 Admin Tool account',
    noAccount: 'No account yet?',
  },
  password: {
    _: 'Password',
    current: 'Current password',
    new: 'New password',
    confirm: 'Confirm new password',
    forgot: 'Forgotten password?',
    change: 'Change current password',
    changed: 'Password has been changed.',
    request: {
      _: 'Request new password',
      subtitle: `Enter your Intake24 account's email address and we'll send you instruction for password reset.`,
      captcha: 'Invalid captcha challenge',
      send: 'Send request',
      sent: 'Password reset instructions has been sent to provided email address.',
      spam: 'Please check your inbox (including spam / junk folder).',
    },
    reset: {
      _: 'Reset password',
      subtitle: 'Enter your email address and new password.',
    },
    update: 'Update password',
    updated: 'Your password has been successfully updated.',
  },
  email: 'Email',
  emailConfirm: 'Confirm email',
  phone: 'Phone',
  terms: {
    _: 'Terms',
    text: 'I agree with Intake24 {privacy} and {tos}.',
    privacy: 'Privacy Policy',
    tos: 'Terms of Service',
  },

  admin: 'Admin',
  fdb: 'Food DBs',
  local: 'Localization',
  images: 'Images',
  surveyMgmt: 'Surveys MGMT',
  acl: 'Access Control',
  system: 'System',

  yes: 'Yes',
  true: 'Yes',
  no: 'No',
  false: 'No',
  none: 'None',
  na: 'N/A',

  name: 'Name',
  displayName: 'Label',
  description: 'Description',
  id: 'ID',
  type: 'Type',
  status: 'Status',
  options: 'Options',

  date: 'Date',
  expiredAt: 'Expired at',
  startedAt: 'Started at',
  completedAt: 'Completed at',
  createdAt: 'Created at',
  updatedAt: 'Updated at',
  deletedAt: 'Deleted at',

  sw: {
    check: 'Content update is available',
    update: 'Update',
  },

  action: {
    _: 'Action',
    active: 'Active',
    add: 'Add',
    audit: 'Audit',
    back: 'Back',
    cancel: 'Cancel',
    clear: 'Clear',
    close: 'Close',
    continue: 'Continue',
    create: 'Add',
    delete: 'Delete',
    destroy: 'Permanently delete',
    read: 'Detail',
    download: 'Download',
    edit: 'Edit',
    export: 'Export',
    load: 'Load',
    ok: 'Confirm',
    print: 'Print',
    remove: 'Remove',
    restore: 'Restore',
    save: 'Save',
    submit: 'Submit',
    sync: 'Synchronize',
    transfer: 'Transfer',
    upload: 'Upload',
    confirm: {
      _: 'Confirm',
      title: 'Do you want to continue?',
      msg: `You're about leave the page with unsaved changes. Do you want to continue?`,
      delete: `Do you want to delete {name}?`,
      multi: {
        delete: 'Do you want to delete selected items: {count}',
      },
    },
  },

  msg: {
    created: 'Record ({name}) has been created.',
    updated: 'Record ({name}) has been updated.',
    deleted: 'Record ({name}) has been deleted.',
    multi: {
      deleted: 'Selected items were deleted ({count}).',
    },
    sent: 'Your message has been sent.',
  },

  search: {
    _: 'Search',
    filter: 'Filter',
    clear: 'Clear filter',
    count: 'Records count',
    selected: 'Records selected',
    none: 'No records found',
  },

  redirect: 'Redirect to new entry',

  selected: '{count} items selected',

  not: {
    found: 'Not found',
    provided: 'Not provided',
    selected: 'Not selected',
  },

  json: {
    _: 'Raw JSON',
    title: 'JSON Content editor',
  },
};

export default common;
