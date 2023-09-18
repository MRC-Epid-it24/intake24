import type { LocaleMessageObject } from 'vue-i18n';

const prompts: LocaleMessageObject = {
  checkboxList: {
    name: 'Senarai pilihan pelbagai',
    text: '',
    description: '',
    label: '',
    other: 'Sila nyatakan',
    validation: {
      required: 'Pilih sekurang-kurangnya satu daripada pelbagai pilihan.',
    },
  },
  datePicker: {
    name: 'Pilih tarikh',
    text: '',
    description: '',
    validation: {
      required: 'Ruangan ini perlu diisi.',
    },
  },
  info: {
    name: 'Maklumat / pengesahan',
    text: '',
    description: '',
  },
  noMoreInformation: {
    name: 'Tiada lagi maklumat yang diperlukan',
    text: 'Tiada lagi maklumat yang diperlukan',
    description: `<p>Kami mempunyai semua maklumat yang diperlukan mengenai <strong>{item}</strong> anda pada masa ini.</p>
        <p>Untuk meneruskan survei, klik butang "Teruskan" di bawah dan secara automatik kami akan memilih makanan atau hidangan seterusnya yang masih memerlukan sedikit maklumat.</p>
       <p>Sebagai alternatif, klik pada hidangan atau makanan di sebelah kiri jika anda ingin menumpu pada item tertentu.</p>`,
  },
  radioList: {
    name: 'Senarai pilihan tunggal',
    text: '',
    description: '',
    label: '',
    other: 'Sila nyatakan',
    validation: {
      required: 'Satu pilihan mesti  dipilih.',
    },
  },
  textarea: {
    name: 'Teks terbuka',
    text: '',
    description: '',
    label: 'Masukkan jawapan anda dalam ruangan teks',
    validation: {
      required: 'Ruangan ini perlu diisi.',
    },
  },
  timePicker: {
    name: 'Pilih masa',
    text: '',
    description: '',
    validation: {
      required: 'Ruangan ini perlu diisi.',
    },
  },
  yesNo: {
    name: 'Pengesahan Ya / Tidak',
    text: '',
    description: '',
  },
  // Standard
  associatedFoods: {
    name: 'Makanan berkaitan',
    text: '',
    description: '',
    yes: 'Ya, saya ada mengambilnya',
    yesAnother: 'Yes, I had another',
    no: 'Tidak, saya tidak mengambilnya',
    moreFoodsQuestion: 'Did you have any other foods from this category?',
    databaseLookupTitle: 'What was it?',
    databaseLookupWithExisting: 'If not, what was it?',
    existingFoodsTitle: 'Was it something you already entered?',
    select: {
      different: 'Pilih makanan yang lain',
      remove: 'Remove',
    },
    browse: 'Browse all foods',
    search: 'Search for a food',
    root: 'all food categories',
    back: `Back to '{category}'`,
    none: 'No food results. Please try refining your search.',
    missing: {
      label: `I can't find my food`,
      description: `<p>Try browsing the food categories listed above to find your food.</p>
      <p>If you still can't find your food select 'Report a missing food'.</p>`,
      report: 'Report a missing food',
      tryAgain: 'OK, let me try again',
    },
  },
  editMeal: {
    name: 'Sunting hidangan',
    text: 'Sila nyatakan segala makanan dan minuman yang telah anda ambil semasa {meal}. Satu baris, satu makanan/minuman.',
    description: `Sebagai contoh:<p><ul><li>pisang</li><li>kerepek</li><li>nasi</li><li>teh</li></ul></p>
      <p>Anda boleh menekan Enter pada papan kekunci anda atau butang "tambah makanan/minuman" semasa menaip untuk ke baris seterusnya</p>
      <p><strong>Anda tidak perlu </strong> menyatakan jumlah yang diambil, hanya perlu mengisi nama makanan yang telah diambil.`,
    add: 'Add',
    drinksOnly: 'Drinks',
    foods: 'Foods and drinks',
    foodsOnly: 'Foods',
  },
  final: {
    name: 'Muka surat terakhir',
    text: '',
    description: '',
  },
  foodSearch: {
    name: 'Cari Makanan',
    text: 'Senarai makanan di bawah adalah daripada pangkalan data kami yang kelihatan seperti "{food}".',
    description: '<p>Pilih item yang anda ambil atau padanan yang terdekat.</p>',
    empty: 'Tiada yang sepadan dalam pangkalan data kami dengan "{searchTerm}".',
    reword: 'Cuba ungkapkan semula penerangan anda.',
    browse: 'Browse all foods',
    search: 'Search for a food',
    root: 'all food categories',
    back: `Back to '{category}'`,
    none: 'No food results. Please try refining your search.',
    missing: {
      label: `I can't find my food`,
      description: `<p>If you can't find your food in the list, try rephrasing your description in the search text box above.</p>
      <p>Or select 'Browse all foods' and explore the food categories.</p>
      <p>If you still can't find your food select 'Report a missing food'.</p>`,
      report: 'Report a missing food',
      tryAgain: 'OK, let me try again',
    },
    confirmDiscardFood: {
      label: 'Yes',
      messageUnsafe: `<p>You have already answered some questions about <strong>"{discardedFoodName}"</strong>!</p>
                <p>If you change it to <strong>"{selectedFoodName}"</strong> now, you might have to answer some of those questions again.</p>
                          <p>Are you sure you would like to replace this food?</p>`,
      message:
        'You have already answered some questions about "{discardedFoodName}"! If you change it to "{selectedFoodName}" now, you might have to answer some of those questions again. Are you sure you would like to replace this food?',
    },
  },
  mealAdd: {
    name: 'Tambah hidangan',
    text: 'Masukkan nama hidangan ini',
    description: 'Pilih satu daripada senarai di bawah jika sesuai.',
    label: 'Pilih hidangan yang telah ditetapkan',
    custom: {
      text: 'Masukkan nama hidangan ini',
      description:
        '<p>Anda boleh menaip nama sendiri atau pilih satu daripada senarai di bawah jika sesuai.</p>',
      label: 'Pilih yang ditetapkan atau masukkan nama hidangan',
    },
    yes: 'Tambah hidangan ini',
    no: 'Batal',
    noMeal: 'Tiada hidangan yang tinggal, tambah sekurang-kurangnya satu hidangan',
  },
  mealDuration: {
    name: 'Meal duration',
    text: '',
    description: '<p>How long did it take you to eat <strong>{mealName}</strong>?</p>',
    minutes: 'mins',
    confirm: 'Continue',
  },
  mealGap: {
    name: 'Meal gap',
    text: '',
    description: '',
    before:
      '<p>Did you have any meals, snacks or drinks before your <strong>{meal}</strong> at {mealTime}?</p>',
    after:
      '<p>Did you have any meals, snacks or drinks after your <strong>{meal}</strong> at {mealTime}?</p>',
    between:
      '<p>Did you have any meals, snacks or drinks between your <strong>{startMeal}</strong> (at {startMealTime}) and your <strong>{endMeal}</strong> (at {endMealTime})?</p>',
    yes: 'Yes, add a meal',
    no: 'No, I did not',
  },
  mealTime: {
    name: 'Sunting masa',
    text: '',
    description: '<p>Did you have <strong>{meal}</strong>? If so, what time was this?</p>',
    yes: 'Sekitar waktu tersebut',
    no: 'Saya tidak mengambil {meal}',
  },
  readyMeal: {
    name: 'Hidangan siap sedia',
    text: '',
    description: `<p>Was this a ready-made meal or food?</p>`,
  },
  redirect: {
    name: 'Mengubah hala',
    text: '',
    description: '',
    missingUrl: 'Missing redirection URL',
    goTo: 'Go to the questionnaire',
  },
  reviewConfirm: {
    name: 'Semak dan Sahkan',
    text: '',
    description: '',
  },
  sameAsBefore: {
    name: 'Sama seperti sebelumnya',
    text: '',
    description: '<p>Was this <strong>{food}</strong> the same as the one you had before?</p>',
    serving: '{amount} serving size',
    leftovers: 'Left about {amount}',
    noLeftovers: {
      drink: 'Drank it all',
      food: 'Ate everything',
    },
    hadWith: 'Had it with:',
    noAddedFoods: 'Nothing added (e.g. milk, sugar, sauces)',
    same: 'Yes, I had the same',
    notSame: 'No, I had a different one',
  },
  splitFood: {
    name: 'Pemisah makanan',
    text: '',
    description: 'Nampaknya anda telah memasukkan lebih daripada satu item makanan pada baris ini.',
    searchTerm: 'Cari istilah: {food}',
    split: 'Adakah ini makanan yang berasingan?',
    singleSuggestion:
      'Klik pada "simpan sebagai makanan tunggal" jika anda maksudkan satu makanan tunggal seperti sup ayam dan sayur-sayuran.',
    singleSuggestionEx:
      'Klik pada "simpan sebagai makanan tunggal" jika anda maksudkan satu makanan seperti {food}.',
    separateSuggestion:
      'Klik pada "makanan berasingan" untuk barangan seperti ikan dan kentang goreng.',
    separateSuggestionEx: 'Klik pada "makanan lain" untuk item seperti {food}.',
    separate: 'Makanan lain',
    single: 'Simpan sebagai hidangan tunggal',
  },
  submit: {
    name: 'Hantar rekod',
    text: '',
    description: '',
  },

  // Portion sizes
  quantity: {
    whole: 'Keseluruhan',
    fraction: 'Sebahagian',
    and: 'dan',
    confirm: 'Saya telah mengambil sebanyak itu',
  },
  portionSizeOption: {
    name: 'Kaedah pembahagian porsi',
    text: '',
    description: 'Bagaimanakah anda ingin menganggarkan saiz porsi {food} anda?',
    selections: {
      grated: 'Diparut',
      in_a_bag: 'Dalam pek',
      in_a_bottle: 'Dalam botol',
      in_a_bowl: 'Dalam mangkuk',
      in_a_can: 'Dalam tin',
      in_a_carton: 'Dalam karton',
      in_a_glass: 'Dalam gelas',
      in_a_mug: 'Dalam mug',
      in_a_pot: 'Dalam bekas',
      in_a_takeaway_cup: 'Dalam cawan bawa pulang',
      in_baby_carrots: 'Dalam bentuk jejari',
      in_bars: 'Dalam bentuk bar',
      in_batons: 'Dalam bentuk sebatang-sebatang',
      in_berries: 'Dalam bentuk sebiji-sebiji',
      in_burgers: 'Dalam bentuk burger',
      in_chopped_fruit: 'Dalam bentuk potongan buah',
      in_crinkle_cut_chips: 'Dalam kerepek beralur',
      in_cubes: 'Dalam kiub',
      in_curly_fries: 'Dalam bentuk kentang goreng bergelung',
      in_dollops: 'Dalam bentuk titisan besar',
      in_french_fries: 'Dalam kentang goreng',
      in_individual_cakes: 'Dalam bentuk pek kek individu',
      in_individual_packs: 'Dalam pek individu',
      in_individual_puddings: 'Dalam sebekas puding individu',
      in_individual_sweets: 'Dalam bentuk sebiji gula-gula',
      in_slices: 'Sepotong',
      in_spoonfuls: 'Dalam sudu',
      in_straight_cut_chips: 'Dalam bentuk kentang berpotongan lurus',
      in_thick_cut_chips: 'Dalam bentuk kentang berpotongan tebal',
      in_unwrapped_bars: 'Dalam bentuk bar yang tidak berbungkus',
      in_whole_fruit_vegetables: 'Dalam bentuk sebiji buah/sayur',
      in_wrapped_bars: 'Dalam bentuk bar yang berbungkus',
      milk_on_cereal: 'Milk on cereal',
      on_a_knife: 'Pada pisau',
      on_a_plate: 'Di atas pinggan',
      slice_from_a_large_cake: 'Potongan daripada sebiji kek besar',
      slice_from_a_large_pudding: 'Potongan daripada sebiji puding besar',
      spread_on_a_cracker: 'Disapu pada biskut',
      spread_on_a_scone: 'Disapu pada scone',
      spread_on_bread: 'Disapu pada roti',
      use_a_standard_measure: 'Ukuran standard',
      use_a_standard_portion: 'Porsi piawai',
      use_an_image: 'Gunakan imej',
      use_these_crisps_in_a_bag: 'Gunakan kerepok ini di dalam pek',
      use_tortilla_chips_in_a_bowl: 'Gunakan kerepek tortilla dalam mangkuk',
      weight: 'Masukkan berat/isipadu',
    },
  },
  linkedAmount: {
    label: `Berapa banyak keping (daripada {quantity}) anda telah ambil {food}.?`,
    unit: 'How many slices',
    all: 'pada kesemuanya',
  },
  asServed: {
    name: 'Seperti yang dihidangkan',
    text: 'Menggunakan prompt di bawah, pilih berapa banyak {food} yang anda ambil, dan sama ada anda mempunyai lebihan makanan',
    description: '',
    serving: {
      header: 'Langkah 1. Pilih saiz porsi anda.',
      less: 'Saya telah mengambil lebih kurang',
      more: 'Saya telah mengambil lebih banyak',
      confirm: 'Saya telah mengambil sebanyak itu',
    },
    leftovers: {
      header: 'Adakah anda meninggalkan sebahagian daripada {food} anda?',
      label: 'Menggunakan gambar ini, pilih jumlah {food} yang telah anda tinggalkan.',
      less: 'Saya telah tinggalkan lebih sedikit',
      more: 'Saya telah tinggalkan lebih banyak',
      confirm: 'Saya telah tinggalkan sebanyak itu',
    },
    weightFactor: {
      serving: {
        more: 'Saya telah mengambil {whole} dan {fraction}',
        less: 'Saya telah mengambil {fraction}',
      },
      leftovers: {
        more: 'Saya telah tinggalkan {whole} dan {fraction}',
        less: 'Saya telah tinggalkan {fraction}',
      },
      // and: 'and',
      less: 'daripada porsi terkecil',
      more: 'daripada porsi terbesar',
    },
  },
  cereal: {
    name: 'Bijirin',
    text: '',
    description: '',
    container:
      'Pilih mangkuk yang paling sama seperti mangkuk yang anda gunakan untuk {food} anda.',
  },
  drinkScale: {
    name: 'Skala minuman',
    text: '',
    description: '',
    container:
      'Pilih cawan atau gelas yang paling sama seperti yang anda gunakan untuk {food} anda.',
    serving: {
      header:
        'Gunakan slider di sebelah kanan atau klik pada cawan atau gelas untuk menunjukkan tahap kepenuhan cawan atau gelas anda.',
      hint: 'Gerakkan penanda ini untuk menunjukkan tahap kepenuhan cawan atau gelas anda.',
      less: 'Ia kurang penuh',
      more: 'Ia lebih penuh',
      confirm: 'Ia penuh sebanyak itu',
    },
    leftovers: {
      header: 'Adakah anda meninggalkan sebahagian daripada {food} anda?',
      label: 'Gunakan slider di sebelah kanan untuk memilih baki lebihan yang anda tinggalkan.',
      less: 'Saya telah tinggalkan lebih sedikit',
      more: 'Saya telah tinggalkan lebih banyak',
      confirm: 'Saya telah tinggalkan sebanyak itu',
    },
    count: 'How many of these drinks did you have at this time?',
  },
  guideImage: {
    name: 'Gambar panduan',
    text: '',
    description: '',
    label: 'Pilih imej yang paling hampir sama dengan saiz {food} yang anda ambil.',
    quantity: 'Pilih berapa banyak yang telah anda ambil.',
    confirm: 'Saya telah mengambil sebanyak itu',
    expand: 'Besarkan imej',
  },
  milkInAHotDrink: {
    name: 'Susu di dalam minuman panas',
    text: '',
    description: '',
    label: 'Berapa banyak {food} yang anda ambil di dalam teh atau kopi anda?',
    confirm: 'Saya telah mengambil sebanyak itu',
  },
  milkOnCereal: {
    name: 'Susu pada bijirin',
    text: '',
    description: '',
    container:
      'Pilih mangkuk yang paling sama seperti mangkuk yang anda gunakan untuk {food} anda.',
    milk: 'Pilih tahap susu anda (tanpa bijirin).',
  },
  missingFood: {
    name: 'Missing food',
    text: '',
    description: `You said you were unable to find a good match for "{food}". Please provide as much detail as you can to the following questions, to help us identify your food or drink.`,
    source: 'Was it homemade?',
    homemade: 'Provide further details e.g. description of dish or ingredients.',
    purchased: 'Tell us where was it purchased from? Does it have a brand name?',
    barcode: 'Can you provide the barcode?',
    portionSize: 'How much did you eat? E.g. 1 pack, 2 teaspoons, 1 handful, 125 grams, ½ cup etc.',
  },
  parentFoodPortion: {
    name: 'Parent food portion',
    text: '',
    description: '',
    label: 'How much {food} did you have in your {parentFood}?',
    confirm: 'I had that much',
  },
  pizza: {
    name: 'Piza',
    text: '',
    description: '',
    typeLabel: 'Pilih piza yang paling hampir dengan saiz yang telah anda ambil.',
    thicknessLabel: 'Berapa tebalkah piza anda?',
    sizeLabel: 'Apakah saiz kepingan piza yang anda ambil?',
    whole: {
      label: 'Berapa banyakkah kepingan daripada piza ini yang telah anda ambil?',
      confirm: 'Saya telah mengambil keseluruhan pizza',
    },
    slices: {
      label: 'Berapa banyak kepingan ini yang anda ambil?',
    },
    confirm: 'Saya telah mengambil sebanyak itu',
  },
  standardPortion: {
    name: 'Porsi standard',
    text: '',
    description: '',
    label: 'Bagaimanakah anda ingin menganggarkan saiz porsi {food} anda?',
    estimateIn: 'Dalam {unit}',
    howMany: {
      _: '{unit} telah anda ambil?',
      placeholder: 'Berapa banyak yang telah anda ambil?',
      withFood: '{unit} {food} yang anda ambil?',
    },
    confirm: 'Saya telah mengambil sebanyak itu',
  },
  unknown: {
    name: 'Tidak diketahui',
    text: '',
    description: 'Pada masa ini tiada kaedah anggaran saiz porsi untuk {food}.',
  },
  weight: {
    name: 'Berat',
    text: '',
    description: 'Masukkan jumlah yang telah anda ambil.',
  },
};

export default prompts;
