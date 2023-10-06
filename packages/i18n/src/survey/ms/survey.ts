import type { LocaleMessageObject } from 'vue-i18n';

const survey: LocaleMessageObject = {
  _: 'Survei',
  info: 'Maklumat survei',
  states: {
    _: 'Status',
    notStarted: 'Pengumpulan data belum bermula.',
    active: 'Pengumpulan data sedang dijalankan.',
    suspended: 'Pengumpulan data telah dihentikan.',
    completed: 'Pengumpulan data telah lengkap.',
  },
  openAccess: {
    _: 'Kajian open access',
    none: {
      _: 'Tiada kajian open access',
      subtitle: 'Tiada sebarang kajian open access buat masa ini.',
    },
  },
  generateUser: {
    _: 'Jana akses',
    subtitle: 'Ini adalah kajian open access, anda boleh mengakses secara percuma.',
    link: 'link',
    info1: `Select 'Generate access' to generate new credentials. Note down these credentials if you would like to resume later.`,
    info2: `This survey will take approximately 20 minutes.`,
    info3: `If you close your browser window you can come back using this {action}.`,
    400: 'Imej keselamatan captcha yang diberikan tidak sah.',
    403: `Survei {surveyId} tidak membenarkan penjanaan pengguna.`,
    404: `Survei {surveyId} tidak dapat dikesan.`,
    429: 'Pengguna Baharu baru sahaja dijana, sila cuba semula sebentar lagi.',
  },
};

export default survey;
