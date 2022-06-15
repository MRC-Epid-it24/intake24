import type { LocaleMessageObject } from 'vue-i18n';

const common: LocaleMessageObject = {
  _: 'Intake24 Admin Tool',
  title: 'Common',
  register: 'Registration',
  login: 'Sign in',
  logout: {
    _: 'Sign out',
    text: 'Sign out from application',
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
    stored: 'Record ({name}) has been stored.',
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
  },

  redirect: 'Redirect to new entry',

  selected: '{count} items selected',

  not: {
    provided: 'Not provided',
    selected: 'Not selected',
  },
};

export default common;
