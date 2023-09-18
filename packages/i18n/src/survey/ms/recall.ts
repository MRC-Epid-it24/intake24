import type { LocaleMessageObject } from 'vue-i18n';

const recall: LocaleMessageObject = {
  _: 'Ingatan semula',
  info: 'Maklumat ingatan semula',
  none: 'Tiada ingatan semula sedang berjalan buat masa ini.',
  startedAt: 'Ingatan semula bermula pada: {startedAt}.',
  finishedAt: 'Ingatan semula selesai pada: {finishedAt}.',
  submittedAt: 'Dihantar pada',
  limitReached: {
    daily: 'Anda telah mencapai had harian ingatan semula.',
    total: 'Anda telah mencapai jumlah had ingatan semula.',
  },
  survey: 'Study: {name}',
  submissions: {
    _: 'Hari ingatan semula',
    title: 'Hari ingatan semula',
    all: 'Semua',
    past: 'Ingatan semula yang lepas',
    none: 'Anda belum mempunyai sebarang ingatan semula yang lepas.',
    count: 'Recall number: {count}',
  },
  start: {
    _: 'Mula',
    another: 'Mulakan yang lain',
  },
  continue: 'Teruskan',
  abort: {
    _: 'Batal',
    label: 'Batalkan ingatan semula',
    confirm: 'Batalkan ingatan semula semasa anda?',
  },
  surveyInfo: {
    recall: 'Recall: {number}',
  },
  menu: {
    title: 'Review panel',
    mealSuggested:
      'Hidangan ini dicadangkan oleh sistem tetapi anda masih belum mengesahkan bahawa anda telah mengambilnya',
    food: {
      delete: 'Delete food',
      edit: 'Change food',
      editPortionSize: 'Edit portion size',
      encoded: 'Makanan ini telah dipadankan dengan makanan daripada pangkalan data kami.',
      missing: 'This food has been marked as missing in our database.',
      notMatched: 'Makanan ini masih belum dipadankan dengan makanan daripada pangkalan data kami.',
      portionSizeComplete: 'Anggaran saiz porsi untuk makanan ini sudah lengkap.',
      portionSizeIncomplete: 'Saiz porsi untuk makanan ini belum diketahui.',
      missingInfoComplete: 'Missing information for this food is complete.',
      missingInfoIncomplete: 'Missing information for this food is not yet known.',
    },
    meal: {
      add: 'Add meal',
      delete: 'Padam hidangan',
      editFoods: 'Sunting/ubah makanan',
      editTime: 'Sunting/ubah masa',
    },
    confirmDelete: 'Do you want to delete {item}?',
  },
  contextMenu: {
    close: 'Tutup',
    select: 'Teruskan dengan {name}',
    editMeal: 'Semak semula makanan',
    delete: 'Padam {name}',
    confirmDeletion: "Adakah anda pasti mahu padam '{name}' ini?",
    confirm: 'Sahkan {name}',
    changeTime: 'Ubah masa',
  },
  actions: {
    feedback: 'Pergi ke maklum balas',
    next: 'Teruskan',
    submit: 'Hantar ingatan semula',
    addMeal: 'Tambah hidangan',
    deleteFood: 'Padam makanan',
    deleteMeal: 'Padam hidangan',
    editFood: 'Edit food',
    editMeal: 'Tambah makanan',
    mealTime: 'Ubah masa hidangan',
    nav: {
      cancel: 'Batal',
      confirm: 'Sahkan',
      feedback: 'Maklum balas',
      next: 'Teruskan',
      redirect: 'Continue',
      remove: 'Hapus',
      review: 'Semak',
      submit: 'Hantar',
      addMeal: 'Tambah hidangan',
      deleteFood: 'Padam makanan',
      deleteMeal: 'Padam hidangan',
      editFood: 'Edit food',
      editMeal: 'Tambah makanan',
      mealTime: 'Masa hidangan',
    },
  },
};

export default recall;
