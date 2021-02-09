import { LocaleMessageObject } from 'vue-i18n';

const common: LocaleMessageObject = {
  _: 'Intake24 Admin Tool',
  dashboard: 'لوحة القيادة',
  register: 'التسجيل',
  login: 'تسجيل الدخول',
  logout: 'خروج',

  admin: 'مشرف',
  local: 'الموقع',
  surveyMgmt: 'استطلاعات MGMT',
  acl: 'التمكن من',
  system: 'النظام',

  yes: 'نعم',
  true: 'نعم',
  no: 'لا',
  false: 'لا',
  none: 'لا شيء',

  name: 'اسم',
  displayName: 'ضع الكلمة المناسبة',
  description: 'وصف',

  createdAt: 'أنشئت في',
  updatedAt: 'تم التحديث في',

  sw: {
    check: 'تحديث المحتوى متاح',
    update: 'تحديث',
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

  not: {
    provided: 'Not provided',
  },
};

export default common;
