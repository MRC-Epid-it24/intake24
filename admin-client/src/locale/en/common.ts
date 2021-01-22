import { LocaleMessageObject } from 'vue-i18n';

const common: LocaleMessageObject = {
  _: 'Intake24 Admin Tool',
  dashboard: 'Dashboard',
  register: 'Registration',
  login: 'Sign in',
  logout: 'Sign out',
  profile: 'Profile',

  admin: 'Admin',
  local: 'Local settings',
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

  locales: {
    dk: 'Danish',
    en: 'English',
    es: 'Spanish',
    pt: 'Portuguese',
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
    multi: {
      delete: 'Delete selected items',
    },
    confirm: {
      delete: 'Do you really want to delete {name}?',
      multi: {
        delete: 'Selected items will be deleted: ',
      },
    },
  },

  search: {
    _: 'Search',
    filter: 'Filter',
    clear: 'Clear filter',
    count: 'Records count',
    selected: 'Records selected',
  },

  msg: {
    stored: 'Record ({name}) has been stored.',
    updated: 'Record ({name}) has been updated.',
    deleted: 'Record ({name}) has been deleted.',
    multi: {
      deleted: 'Selected items were deleted.',
    },
    sent: 'Your message has been sent.',
  },
};

export default common;
