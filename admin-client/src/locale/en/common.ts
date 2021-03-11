import { LocaleMessageObject } from 'vue-i18n';

const common: LocaleMessageObject = {
  _: 'Intake24 Admin Tool',
  register: 'Registration',
  login: 'Sign in',
  logout: {
    _: 'Sign out',
    text: 'Sign out from application',
  },

  admin: 'Admin',
  local: 'Localization',
  surveyMgmt: 'Surveys MGMT',
  acl: 'Access Control',
  system: 'System',

  yes: 'Yes',
  true: 'Yes',
  no: 'No',
  false: 'No',
  none: 'None',

  name: 'Name',
  displayName: 'Label',
  description: 'Description',

  createdAt: 'Created at',
  updatedAt: 'Updated at',

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
    create: 'Add',
    delete: 'Delete',
    destroy: 'Permanently delete',
    detail: 'Detail',
    download: 'Download',
    edit: 'Edit',
    export: 'Export',
    load: 'Load',
    ok: 'Confirm',
    print: 'Print',
    questions: 'Questions',
    remove: 'Remove',
    restore: 'Restore',
    save: 'Save',
    show: 'Info',
    transfer: 'Transfer',
    confirm: {
      _: 'Confirm',
      title: 'Do you want to continue?',
      delete: `Do you want to delete '{name}'?`,
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

  not: {
    provided: 'Not provided',
  },
};

export default common;
