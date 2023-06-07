import type { LocaleMessageObject } from 'vue-i18n';

const common: LocaleMessageObject = {
  _: 'Intake24 Admin Tool',
  title: 'Common',
  login: {
    _: 'Sign in',
    subtitle: 'Sign in to Intake24 Admin Tool account',
    back: 'Back to login',
  },
  mfa: {
    _: 'MFA',
    title: 'Confirm authentication challenge',
    devices: 'Other devices',
    otp: 'Enter one-time password',
    error: 'Invalid authentication challenge. Try again.',
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
  verify: {
    _: 'Account verification',
    subtitle: 'Verify your account using the link we sent you to your inbox.',
    text: 'If you did not receive the email, check your spam folder or click the button below to request a new one.',
    resend: 'Resent verification email',
    resent: 'Verification email was sent to your inbox',
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
  spam: 'If you did not receive the email, check your spam / junk folder or click the button below to request a new one.',
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
    redirect: 'Redirect',
    restore: 'Restore',
    reset: 'Reset',
    retry: 'Retry',
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
      remove: `Do you want to remove {name}?`,
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
    assigned: 'Not assigned',
    found: 'Not found',
    provided: 'Not provided',
    selected: 'Not selected',
  },

  json: {
    _: 'Raw JSON',
    title: 'JSON Content editor',
  },

  file: {
    csv: 'CSV file to upload',
  },
};

export default common;
